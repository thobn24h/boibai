import { _decorator, Component, director, Node, resources, Sprite, SpriteFrame, WebView } from 'cc';
import GameManager from './GameManager';
import Database from './Database';
const { ccclass, property } = _decorator;

@ccclass('CHTTContentScene')
export class CHTTContentScene extends Component {

    @property(WebView)
    webView: WebView = null;

    @property(Sprite)
    imvCard1: Sprite = null;

    @property(Sprite)
    imvCard2: Sprite = null;

    @property(Sprite)
    imvCard3: Sprite = null;

    idCard1 = 0;
    idCard2 = 0;
    idCard3 = 0;

    changeDisplayCardImage(spCard: Node, tag: string) {
      const sprite = spCard.getComponent(Sprite)

      // Load ảnh từ thư mục resources/images
      resources.load(`${tag}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
          if (err) {
              console.error('Lỗi khi load ảnh:', err);
              return;
          }

          // Gắn spriteFrame vào Sprite component
          sprite.getComponent(Sprite).spriteFrame = spriteFrame;
      });
    }
    
    
    protected onLoad(): void {
        this.idCard1 = GameManager.instance.idCard1;
        this.idCard2 = GameManager.instance.idCard2;
        this.idCard3 = GameManager.instance.idCard3;

        // WebView sẽ được set content trong start()
        this.changeDisplayCardImage(this.imvCard1.node, `${this.idCard1}`);
        this.changeDisplayCardImage(this.imvCard2.node, `${this.idCard2}`);
        this.changeDisplayCardImage(this.imvCard3.node, `${this.idCard3}`);
        
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
     * Lấy số ngẫu nhiên trong khoảng [min, max]
     */
    private getRandomNumberBetween(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    setContentHtml(): void {
        const db = Database.instance;
        
        // Lấy nội dung ngẫu nhiên từ database
        const contentBM = db.getBonMangById(this.getRandomNumberBetween(1, 112));
        const contentTL = db.getTailocById(this.getRandomNumberBetween(1, 108));
        const contentGD = db.getGiadaoById(this.getRandomNumberBetween(1, 124));
        
        // Build HTML table
        let tableContent = '';
        tableContent += '<table style="font-size:16px;" width="100%" >';
        tableContent += `<tr><td valign="center" align="left" width="100%"><div style="font-size:32px; color: yellow;">Bổn mạng:</div><div style="font-size:24px;">${contentBM || ''}</div></td></tr>`;
        tableContent += `<tr><td valign="center" align="left" width="100%"><div style="font-size:32px; color: yellow;">Tài lộc:</div><div style="font-size:24px;">${contentTL || ''}</div></td></tr>`;
        tableContent += `<tr><td valign="center" align="left" width="100%"><div style="font-size:32px; color: yellow;">Gia đạo:</div><div style="font-size:24px;">${contentGD || ''}</div></td></tr>`;
        tableContent += '</table>';
        
        // Build full HTML
        const html = `
            <html>
            <head>
                <style type="text/css">
                    body {
                        background-color: transparent;
                        font-family: Marker Felt;
                        font-size: 16px;
                        color: white;
                    }
                </style>
            </head>
            <body width="100%" style="margin:0">
                ${tableContent}
            </body>
            </html>
        `;
        
        // Load HTML vào WebView
        if (this.webView) {
            this.webView.url = this.createDataUrl(html);
            console.log('[CHTTContentScene] HTML loaded successfully');
        } else {
            console.error('[CHTTContentScene] WebView không tồn tại');
        }
    }

    /**
     * Tạo Data URL từ HTML string để load vào WebView
     */
    private createDataUrl(html: string): string {
        const encodedHtml = encodeURIComponent(html);
        return `data:text/html;charset=utf-8,${encodedHtml}`;
    }

    backClick(): void {
        director.loadScene('SelectGenderCHTTScene');
    }
}

