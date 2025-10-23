import { _decorator, Component, Node, resources, Sprite, SpriteFrame, WebView } from 'cc';
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
      const sprite = spCard.addComponent(Sprite)

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

    setContentHtml(): void {
        
    }
}

