import { _decorator, Component, director, Node, resources, Sprite, SpriteFrame, WebView, sys, RichText, Prefab, instantiate } from 'cc';
import GameManager from './GameManager';
import Database from './Database';
import { LabelTitle } from './LabelTitle';
import { LabelContent } from './LabelContent';
const { ccclass, property } = _decorator;

@ccclass('CHTTContentScene')
export class CHTTContentScene extends Component {

  @property(Node)
  contentNode: Node = null

  @property(Prefab)
  labelTitlePrefab: Prefab = null

  @property(Prefab)
  labelContentPrefab: Prefab = null

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

        const labelTitle1 = instantiate(this.labelTitlePrefab);
        labelTitle1.getComponent(LabelTitle).setContent('Bổn mạng:');
        this.contentNode.addChild(labelTitle1);

        const labelContent1 = instantiate(this.labelContentPrefab);
        labelContent1.getComponent(LabelContent).setContent(contentBM);
        this.contentNode.addChild(labelContent1);
        
        const labelTitle2 = instantiate(this.labelTitlePrefab);
        labelTitle2.getComponent(LabelTitle).setContent('Tài lộc:');
        this.contentNode.addChild(labelTitle2);

        const labelContent2 = instantiate(this.labelContentPrefab);
        labelContent2.getComponent(LabelContent).setContent(contentTL);
        this.contentNode.addChild(labelContent2);
        
        const labelTitle3 = instantiate(this.labelTitlePrefab);
        labelTitle3.getComponent(LabelTitle).setContent('Gia đạo:');
        this.contentNode.addChild(labelTitle3);

        const labelContent3 = instantiate(this.labelContentPrefab);
        labelContent3.getComponent(LabelContent).setContent(contentGD);
        this.contentNode.addChild(labelContent3);
        
    }

    backClick(): void {
        director.loadScene('SelectGenderCHTTScene');
    }
}

