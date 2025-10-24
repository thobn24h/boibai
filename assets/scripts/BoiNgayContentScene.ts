import { _decorator, Component, director, Node, WebView } from 'cc';
import { Database } from './Database';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('BoiNgayContentScene')
export class BoiNgayContentScene extends Component {

    @property(WebView)
    webView: WebView = null;

    protected onLoad(): void {
        // WebView sẽ được set content trong start()
    }

    async start() {
        try {
            // Khởi tạo Database nếu chưa
            if (!Database.instance.isInitialized()) {
                await Database.instance.init();
            }
            
            // Set content HTML vào WebView
            this.setContentHtml();
            
        } catch (error) {
            console.error('[BoiNgayContentScene] Lỗi khi khởi tạo:', error);
        }
    }

    /**
     * Convert từ Objective-C SetContentHtml
     * Tạo HTML content dựa trên idCard1, idCard2, idCard3 và load vào WebView
     */
    private setContentHtml(): void {
        // Demo data
        GameManager.instance.setCardByIndex(1, 1);
        GameManager.instance.setCardByIndex(2, 2);
        GameManager.instance.setCardByIndex(3, 3);

        // Lấy các ID cards từ GameManager
        let idCard1 = GameManager.instance.idCard1 || 0;
        let idCard2 = GameManager.instance.idCard2 || 0;
        let idCard3 = GameManager.instance.idCard3 || 0;

        // Hiệu chỉnh: Nếu ID > 13 thì đặt về 1
        if (idCard1 > 13) {
            idCard1 = 1;
        }
        if (idCard2 > 13) {
            idCard2 = 1;
        }
        if (idCard3 > 13) {
            idCard3 = 1;
        }

        // Hiệu chỉnh: Nếu có lá bài trùng nhau
        if (idCard1 === idCard2) {
            idCard2 = 0;
            idCard3 = 0;
        } else {
            if (idCard2 === idCard3) {
                idCard3 = 0;
            }
        }

        console.log('[BoiNgayContentScene] Loading content for cards:', {idCard1, idCard2, idCard3});

        // Lấy content từ Database
        const contentDoi1 = idCard1 !== 0 ? Database.instance.getContentByCardId(idCard1) : '';
        const contentDoi2 = idCard2 !== 0 ? Database.instance.getContentByCardId(idCard2) : '';
        const contentDoi3 = idCard3 !== 0 ? Database.instance.getContentByCardId(idCard3) : '';

        let html = '';

        // Case 1: Chỉ có 1 lá bài (idCard2 == 0)
        if (idCard2 === 0) {
            html = this.generateHtml1Card(contentDoi1);
        }
        // Case 2: Có 2 lá bài (idCard2 != 0 && idCard3 == 0)
        else if (idCard2 !== 0 && idCard3 === 0) {
            html = this.generateHtml2Cards(contentDoi1, contentDoi2);
        }
        // Case 3: Có 3 lá bài (idCard3 != 0)
        else if (idCard3 !== 0) {
            html = this.generateHtml3Cards(contentDoi1, contentDoi2, contentDoi3);
        }

        // Load HTML vào WebView
        if (this.webView && html) {
            this.webView.url = this.createDataUrl(html);
            console.log('[BoiNgayContentScene] HTML loaded successfully');
        } else {
            console.warn('[BoiNgayContentScene] WebView hoặc HTML không hợp lệ');
        }
    }

    /**
     * Tạo HTML cho trường hợp 1 lá bài
     */
    private generateHtml1Card(content1: string): string {
        let tableContent = '';
        tableContent += '<table style="font-size:32px;" width="100%">';
        tableContent += `<tr><td valign="top" align="left" width="100%"><div style="font-size:32px; color: yellow;">Ngày hôm nay:</div><div style="font-size:24px;">${content1}</div></td></tr>`;
        tableContent += '</table>';

        return this.wrapHtmlTemplate(tableContent);
    }

    /**
     * Tạo HTML cho trường hợp 2 lá bài
     */
    private generateHtml2Cards(content1: string, content2: string): string {
        let tableContent = '';
        tableContent += '<table style="font-size:16px;" width="100%">';
        tableContent += `<tr><td valign="top" align="left" width="100%"><div style="font-size:32px; color: yellow;">Ngày hôm nay:</div><div style="font-size:24px;">${content1}</div></td></tr>`;
        tableContent += `<tr><td valign="top" align="left" width="100%"><div style="font-size:32px; color: yellow;">Tuy nhiên quẻ bài cũng cho thấy:</div><div style="font-size:24px;">${content2}</div></td></tr>`;
        tableContent += '</table>';

        return this.wrapHtmlTemplate(tableContent);
    }

    /**
     * Tạo HTML cho trường hợp 3 lá bài
     */
    private generateHtml3Cards(content1: string, content2: string, content3: string): string {
        let tableContent = '';
        tableContent += '<table style="font-size:32px;" width="100%">';
        tableContent += `<tr><td valign="top" align="left" width="100%"><div style="font-size:32px; color: yellow;">Ngày hôm nay:</div><div style="font-size:24px;">${content1}</div></td></tr>`;
        tableContent += `<tr><td valign="top" align="left" width="100%"><div style="font-size:32px; color: yellow;">Quẻ bài cũng cho thấy:</div><div style="font-size:24px;">${content2}</div></td></tr>`;
        tableContent += `<tr><td valign="top" align="left" width="100%"><div style="font-size:32px; color: yellow;">Từ quẻ bài cũng nói lên:</div><div style="font-size:24px;">${content3}</div></td></tr>`;
        tableContent += '</table>';

        return this.wrapHtmlTemplate(tableContent);
    }

    /**
     * Wrap table content với HTML template
     */
    private wrapHtmlTemplate(tableContent: string): string {
        return `
            <html>
            <head>
                <style type="text/css">
                    body {
                        background-color: transparent;
                        font-family: Marker Felt, Arial, sans-serif;
                        font-size: 32px;
                        color: white;
                    }
                </style>
            </head>
            <body width="100%" style="margin:0">
                ${tableContent}
            </body>
            </html>
        `;
    }

    /**
     * Tạo Data URL từ HTML string để load vào WebView
     */
    private createDataUrl(html: string): string {
        // Encode HTML thành base64 hoặc sử dụng data URL
        const encodedHtml = encodeURIComponent(html);
        return `data:text/html;charset=utf-8,${encodedHtml}`;
    }

    update(deltaTime: number) {
        
    }

    clickBack() {
      director.loadScene('menuScene');
    }
}

