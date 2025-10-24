import {
    BN_CONTENT_DATA,
    CHTT_BONMANG_DATA,
    CHTT_GIADAO_DATA,
    CHTT_TAILOC_DATA,
    BNContent,
    CHTTBonmang,
    CHTTGiadao,
    CHTTTailoc
} from './DatabaseData';

/**
 * Database Service - Quản lý truy vấn dữ liệu từ in-memory objects
 * Thay thế sql.js bằng JavaScript objects để đơn giản và tương thích với mọi platform
 */
export class Database {
    private static _instance: Database;
    private initialized: boolean = false;

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
     * Khởi tạo database (không cần làm gì vì data đã có sẵn trong memory)
     */
    async init(): Promise<void> {
        if (this.initialized) {
            console.log('[Database] Đã khởi tạo rồi');
            return;
        }

        console.log('[Database] Bắt đầu khởi tạo...');
        console.log('[Database] ✅ Loaded data:');
        console.log(`  - BN_Content: ${BN_CONTENT_DATA.length} records`);
        console.log(`  - CHTT_Bonmang: ${CHTT_BONMANG_DATA.length} records`);
        console.log(`  - CHTT_Giadao: ${CHTT_GIADAO_DATA.length} records`);
        console.log(`  - CHTT_Tailoc: ${CHTT_TAILOC_DATA.length} records`);
        
        this.initialized = true;
        console.log('[Database] ✅ Khởi tạo thành công!');
    }

    /**
     * Kiểm tra xem database đã được khởi tạo chưa
     */
    isInitialized(): boolean {
        return this.initialized;
    }

    /**
     * Lấy nội dung từ bảng BN_Content theo idCard
     * @param idCard - ID của card cần lấy nội dung
     * @returns Nội dung của card hoặc null nếu không tìm thấy
     */
    getContentByCardId(idCard: number): string | null {
        const record = BN_CONTENT_DATA.find(item => item.idCard === idCard);
        return record ? record.content : null;
    }

    /**
     * Lấy tất cả nội dung từ bảng BN_Content
     * @returns Mảng các object chứa idCard và content
     */
    getAllContent(): BNContent[] {
        return [...BN_CONTENT_DATA];
    }

    /**
     * Lấy nội dung Bổn Mạng từ bảng CHTT_Bonmang theo idBonmang
     * @param idBonmang - ID của Bổn Mạng cần lấy nội dung
     * @returns Nội dung Bổn Mạng hoặc null nếu không tìm thấy
     */
    getBonMangById(idBonmang: number): string | null {
        const record = CHTT_BONMANG_DATA.find(item => item.idBonmang === idBonmang);
        return record ? record.content : null;
    }

    /**
     * Lấy tất cả Bổn Mạng
     * @returns Mảng tất cả records
     */
    getAllBonMang(): CHTTBonmang[] {
        return [...CHTT_BONMANG_DATA];
    }

    /**
     * Lấy nội dung Gia Đạo từ bảng CHTT_Giadao theo idGiadao
     * @param idGiadao - ID của Gia Đạo cần lấy nội dung
     * @returns Nội dung Gia Đạo hoặc null nếu không tìm thấy
     */
    getGiadaoById(idGiadao: number): string | null {
        const record = CHTT_GIADAO_DATA.find(item => item.idGiadao === idGiadao);
        return record ? record.content : null;
    }

    /**
     * Lấy tất cả Gia Đạo
     * @returns Mảng tất cả records
     */
    getAllGiadao(): CHTTGiadao[] {
        return [...CHTT_GIADAO_DATA];
    }

    /**
     * Lấy nội dung Tài Lộc từ bảng CHTT_Tailoc theo idTailoc
     * @param idTailoc - ID của Tài Lộc cần lấy nội dung
     * @returns Nội dung Tài Lộc hoặc null nếu không tìm thấy
     */
    getTailocById(idTailoc: number): string | null {
        const record = CHTT_TAILOC_DATA.find(item => item.idTailoc === idTailoc);
        return record ? record.content : null;
    }

    /**
     * Lấy tất cả Tài Lộc
     * @returns Mảng tất cả records
     */
    getAllTailoc(): CHTTTailoc[] {
        return [...CHTT_TAILOC_DATA];
    }

    /**
     * Lấy tất cả bảng trong database (chỉ để tương thích với API cũ)
     * @returns Mảng tên các bảng
     */
    getAllTables(): string[] {
        return ['BN_Content', 'CHTT_Bonmang', 'CHTT_Giadao', 'CHTT_Tailoc'];
    }

    /**
     * Đóng kết nối database (không cần làm gì cho in-memory data)
     */
    close(): void {
        this.initialized = false;
        console.log('[Database] Đã đóng kết nối database');
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

    /**
     * Log trạng thái hiện tại
     */
    logState(): void {
        console.log('[Database] Current state:', {
            initialized: this.initialized,
            totalRecords: {
                BN_Content: BN_CONTENT_DATA.length,
                CHTT_Bonmang: CHTT_BONMANG_DATA.length,
                CHTT_Giadao: CHTT_GIADAO_DATA.length,
                CHTT_Tailoc: CHTT_TAILOC_DATA.length
            }
        });
    }
}

export default Database;
