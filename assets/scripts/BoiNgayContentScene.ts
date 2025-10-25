import { _decorator, Component, director, Node, WebView, sys, RichText, Prefab, instantiate } from 'cc';
import { Database } from './Database';
import { GameManager } from './GameManager';
import { LabelTitle } from './LabelTitle';
import { LabelContent } from './LabelContent';
const { ccclass, property } = _decorator;

@ccclass('BoiNgayContentScene')
export class BoiNgayContentScene extends Component {

  @property(Node)
  contentNode: Node = null

  @property(Prefab)
  labelTitlePrefab: Prefab = null

  @property(Prefab)
  labelContentPrefab: Prefab = null

    protected onLoad(): void {
        this.setContent();
    }
    
    async start() {
        
    }

    /**
     * Convert từ Objective-C SetContentHtml
     * Tạo HTML content dựa trên idCard1, idCard2, idCard3 và load vào WebView
     */
    private setContent(): void {
        // Demo data
        // GameManager.instance.setCardByIndex(1, 1);
        // GameManager.instance.setCardByIndex(2, 2);
        // GameManager.instance.setCardByIndex(3, 3);

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
        
        const contentDoi2 = idCard2 !== 0 ? Database.instance.getContentByCardId(idCard2) : '';
        const contentDoi3 = idCard3 !== 0 ? Database.instance.getContentByCardId(idCard3) : '';

        if (idCard1 !== 0) {
          const contentDoi1 = idCard1 !== 0 ? Database.instance.getContentByCardId(idCard1) : '';
        
          const labelTitle = instantiate(this.labelTitlePrefab);
          labelTitle.getComponent(LabelTitle).setContent('Ngày hôm nay:');
          this.contentNode.addChild(labelTitle);

          const labelContent = instantiate(this.labelContentPrefab);
          labelContent.getComponent(LabelContent).setContent(contentDoi1);
          this.contentNode.addChild(labelContent);
        }

        if (idCard2 !== 0) {
          const labelTitle = instantiate(this.labelTitlePrefab);
          labelTitle.getComponent(LabelTitle).setContent('Quẻ bài cũng cho thấy:');
          this.contentNode.addChild(labelTitle);

          const labelContent = instantiate(this.labelContentPrefab);
          labelContent.getComponent(LabelContent).setContent(contentDoi2);
          this.contentNode.addChild(labelContent);
        }

        if (idCard3 !== 0) {
          const labelTitle = instantiate(this.labelTitlePrefab);
          labelTitle.getComponent(LabelTitle).setContent('Từ quẻ bài cũng nói lên:');
          this.contentNode.addChild(labelTitle);

          const labelContent = instantiate(this.labelContentPrefab);
          labelContent.getComponent(LabelContent).setContent(contentDoi3);
          this.contentNode.addChild(labelContent);
        }
    }

    
    update(deltaTime: number) {
        
    }

    clickBack() {
      director.loadScene('menuScene');
    }
}

