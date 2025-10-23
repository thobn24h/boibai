import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import { resources } from 'cc';

/**
 * Database Service - Quản lý kết nối và truy vấn SQLite database
 * Sử dụng sql.js để truy vấn file DB_Boibai.sqlite
 */
export class Database {
    private static _instance: Database;
    private db: SqlJsDatabase | null = null;
    private initialized: boolean = false;
    private SQL: any = null;

    /**
     * Singleton instance
     */
    static get instance(): Database {
        if (!this._instance) {
            this._instance = new Database();
        }
        return this._instance;
    }

    private constructor() {}

    /**
     * Khởi tạo database
     * Load WASM file và SQLite database file từ resources
     */
    async init(): Promise<void> {
        if (this.initialized) {
            console.log('[Database] Đã khởi tạo rồi');
            return;
        }

        try {
            console.log('[Database] Bắt đầu khởi tạo...');

            // Bước 1: Load WASM file
            await this.loadWasm();

            // Bước 2: Load Database file
            await this.loadDatabaseFile();

            this.initialized = true;
            console.log('[Database] ✅ Khởi tạo thành công!');

        } catch (error) {
            console.error('[Database] ❌ Lỗi khởi tạo:', error);
            throw error;
        }
    }

    /**
     * Load WASM file từ assets/resources/libs/sql-wasm.wasm
     */
    private async loadWasm(): Promise<void> {
        console.log('[Database] Đang load WASM file...');

        return new Promise((resolve, reject) => {
            // Load WASM file từ resources
            resources.load('libs/sql-wasm', (err: Error | null, asset: any) => {
                if (err) {
                    console.error('[Database] Lỗi load WASM:', err);
                    reject(err);
                    return;
                }

                // Lấy nativeUrl của WASM file
                const wasmUrl = asset.nativeUrl;
                console.log('[Database] WASM URL:', wasmUrl);

                // Khởi tạo sql.js với WASM file
                initSqlJs({
                    locateFile: () => wasmUrl
                })
                .then((SQL) => {
                    this.SQL = SQL;
                    console.log('[Database] ✅ Load WASM thành công');
                    resolve();
                })
                .catch((error) => {
                    console.error('[Database] Lỗi khởi tạo sql.js:', error);
                    reject(error);
                });
            });
        });
    }

    /**
     * Load database file từ assets/resources/db/DB_Boibai.sqlite
     */
    private async loadDatabaseFile(): Promise<void> {
        console.log('[Database] Đang load database file...');

        return new Promise((resolve, reject) => {
            // Load SQLite database file từ resources
            resources.load('db/DB_Boibai', (err: Error | null, asset: any) => {
                if (err) {
                    console.error('[Database] Lỗi load database file:', err);
                    reject(err);
                    return;
                }

                // Lấy nativeUrl của database file
                const dbUrl = asset.nativeUrl;
                console.log('[Database] Database URL:', dbUrl);

                // Fetch database file và load vào sql.js
                fetch(dbUrl)
                    .then(response => response.arrayBuffer())
                    .then(buffer => {
                        const uint8Array = new Uint8Array(buffer);
                        this.db = new this.SQL.Database(uint8Array);
                        console.log('[Database] ✅ Load database thành công');
                        resolve();
                    })
                    .catch(error => {
                        console.error('[Database] Lỗi fetch database:', error);
                        reject(error);
                    });
            });
        });
    }

    /**
     * Kiểm tra xem database đã được khởi tạo chưa
     */
    isInitialized(): boolean {
        return this.initialized && this.db !== null;
    }

    /**
     * Thực thi câu lệnh SQL và trả về kết quả
     * @param sql - Câu lệnh SQL cần thực thi
     * @param params - Tham số cho câu lệnh SQL (optional)
     * @returns Mảng kết quả
     */
    query(sql: string, params: any[] = []): any[] {
        if (!this.db) {
            throw new Error('[Database] Database chưa được khởi tạo. Hãy gọi init() trước.');
        }

        try {
            const results = this.db.exec(sql, params);
            
            if (results.length > 0) {
                return results[0].values;
            }
            
            return [];
        } catch (error) {
            console.error('[Database] Lỗi thực thi query:', error);
            throw error;
        }
    }

    /**
     * Thực thi câu lệnh SQL không trả về kết quả (INSERT, UPDATE, DELETE)
     * @param sql - Câu lệnh SQL cần thực thi
     * @param params - Tham số cho câu lệnh SQL (optional)
     */
    exec(sql: string, params: any[] = []): void {
        if (!this.db) {
            throw new Error('[Database] Database chưa được khởi tạo. Hãy gọi init() trước.');
        }

        try {
            this.db.run(sql, params);
        } catch (error) {
            console.error('[Database] Lỗi thực thi exec:', error);
            throw error;
        }
    }

    /**
     * Lấy nội dung từ bảng BN_Content theo idCard
     * @param idCard - ID của card cần lấy nội dung
     * @returns Nội dung của card hoặc null nếu không tìm thấy
     */
    getContentByCardId(idCard: number): string | null {
        try {
            const results = this.query(
                'SELECT content FROM BN_Content WHERE idCard = ?',
                [idCard]
            );

            if (results.length > 0) {
                return results[0][0] as string;
            }

            return null;
        } catch (error) {
            console.error('[Database] Lỗi lấy content theo idCard:', error);
            throw error;
        }
    }

    /**
     * Lấy tất cả nội dung từ bảng BN_Content
     * @returns Mảng các object chứa idCard và content
     */
    getAllContent(): Array<{idCard: number, content: string}> {
        try {
            const results = this.query('SELECT idCard, content FROM BN_Content');

            return results.map((row: any[]) => ({
                idCard: row[0] as number,
                content: row[1] as string
            }));
        } catch (error) {
            console.error('[Database] Lỗi lấy tất cả content:', error);
            throw error;
        }
    }

    /**
     * Lấy tất cả bảng trong database
     * @returns Mảng tên các bảng
     */
    getAllTables(): string[] {
        try {
            const results = this.query(
                "SELECT name FROM sqlite_master WHERE type='table'"
            );

            return results.map((row: any[]) => row[0] as string);
        } catch (error) {
            console.error('[Database] Lỗi lấy danh sách bảng:', error);
            throw error;
        }
    }

    /**
     * Export database thành Uint8Array
     * @returns Uint8Array chứa dữ liệu database
     */
    export(): Uint8Array {
        if (!this.db) {
            throw new Error('[Database] Database chưa được khởi tạo.');
        }
        return this.db.export();
    }

    /**
     * Đóng kết nối database
     */
    close(): void {
        if (this.db) {
            this.db.close();
            this.db = null;
            this.initialized = false;
            console.log('[Database] Đã đóng kết nối database');
        }
    }

    /**
     * Reset singleton instance (chủ yếu dùng cho testing)
     */
    static reset(): void {
        if (Database._instance) {
            Database._instance.close();
            Database._instance = null as any;
        }
    }
}

export default Database;
