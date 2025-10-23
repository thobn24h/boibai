/**
 * GameManager - Singleton quản lý trạng thái game
 * Lưu trữ dữ liệu cần chia sẻ giữa các scene
 */
export class GameManager {
    private static _instance: GameManager;

    // Lưu trữ ID của 3 lá bài
    private _idCard1: number | null = null;
    private _idCard2: number | null = null;
    private _idCard3: number | null = null;

    private checkMale: boolean = true;

    /**
     * Singleton instance
     */
    static get instance(): GameManager {
        if (!this._instance) {
            this._instance = new GameManager();
        }
        return this._instance;
    }

    private constructor() {
        console.log('[GameManager] Khởi tạo GameManager');
    }

    /**
     * Getter/Setter cho idCard1
     */
    get idCard1(): number | null {
        return this._idCard1;
    }

    set idCard1(value: number | null) {
        this._idCard1 = value;
        console.log('[GameManager] Set idCard1:', value);
    }

    /**
     * Getter/Setter cho idCard2
     */
    get idCard2(): number | null {
        return this._idCard2;
    }

    set idCard2(value: number | null) {
        this._idCard2 = value;
        console.log('[GameManager] Set idCard2:', value);
    }

    /**
     * Getter/Setter cho idCard3
     */
    get idCard3(): number | null {
        return this._idCard3;
    }

    set idCard3(value: number | null) {
        this._idCard3 = value;
        console.log('[GameManager] Set idCard3:', value);
    }

    /**
     * Set tất cả 3 cards cùng lúc
     */
    setAllCards(idCard1: number, idCard2: number, idCard3: number): void {
        this._idCard1 = idCard1;
        this._idCard2 = idCard2;
        this._idCard3 = idCard3;
        console.log('[GameManager] Set all cards:', {idCard1, idCard2, idCard3});
    }

    /**
     * Lấy tất cả 3 cards
     */
    getAllCards(): {idCard1: number | null, idCard2: number | null, idCard3: number | null} {
        return {
            idCard1: this._idCard1,
            idCard2: this._idCard2,
            idCard3: this._idCard3
        };
    }

    /**
     * Lấy card theo index (1, 2, hoặc 3)
     */
    getCardByIndex(index: 1 | 2 | 3): number | null {
        switch (index) {
            case 1:
                return this._idCard1;
            case 2:
                return this._idCard2;
            case 3:
                return this._idCard3;
            default:
                console.warn('[GameManager] Index không hợp lệ:', index);
                return null;
        }
    }

    /**
     * Set card theo index (1, 2, hoặc 3)
     */
    setCardByIndex(index: 1 | 2 | 3, value: number): void {
        switch (index) {
            case 1:
                this.idCard1 = value;
                break;
            case 2:
                this.idCard2 = value;
                break;
            case 3:
                this.idCard3 = value;
                break;
            default:
                console.warn('[GameManager] Index không hợp lệ:', index);
        }
    }

    /**
     * Lấy danh sách tất cả cards dưới dạng array
     */
    getCardsArray(): (number | null)[] {
        return [this._idCard1, this._idCard2, this._idCard3];
    }

    /**
     * Kiểm tra xem đã có đủ 3 cards chưa
     */
    hasAllCards(): boolean {
        return this._idCard1 !== null && 
               this._idCard2 !== null && 
               this._idCard3 !== null;
    }

    /**
     * Đếm số lượng cards đã được set
     */
    getCardCount(): number {
        let count = 0;
        if (this._idCard1 !== null) count++;
        if (this._idCard2 !== null) count++;
        if (this._idCard3 !== null) count++;
        return count;
    }

    /**
     * Reset tất cả các cards về null
     */
    resetCards(): void {
        this._idCard1 = null;
        this._idCard2 = null;
        this._idCard3 = null;
        console.log('[GameManager] Reset all cards');
    }

    /**
     * Log trạng thái hiện tại
     */
    logState(): void {
        console.log('[GameManager] Current state:', {
            idCard1: this._idCard1,
            idCard2: this._idCard2,
            idCard3: this._idCard3,
            hasAllCards: this.hasAllCards(),
            cardCount: this.getCardCount()
        });
    }

    /**
     * Reset singleton instance (chủ yếu dùng cho testing)
     */
    static reset(): void {
        if (GameManager._instance) {
            GameManager._instance.resetCards();
            GameManager._instance = null as any;
        }
    }

    setCheckMale(value: boolean): void {
        this.checkMale = value;
    }

    getCheckMale(): boolean {
        return this.checkMale;
    }
}

export default GameManager;

