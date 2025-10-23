import { _decorator, Component, director, EventTouch, input, Input, Label, Layers, Node, resources, Sprite, SpriteFrame, Tween, tween, UITransform, Vec2, Vec3, view } from 'cc';
import GameManager from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('ActionsCard')
export class ActionsCard extends Component {

    @property(Node)
    canvasNode: Node = null;

    @property(Node)
    card1: Node = null;

    @property(Node)
    card2: Node = null;

    @property(Node)
    lblGioithieu: Node = null;

    @property(Label)
    lblThongbao: Label = null;
    
    @property(SpriteFrame)
    queSpriteFrame: SpriteFrame = null;

    isTouchEnabled = true;
    numberCards = 0;
    zCards = 0;
    tagCards = 0;
    angleCards = -95;
    numberCardsSelected = 0;
    
    idCard1 = 0;
    idCard2 = 0;
    idCard3 = 0;
    flag = false;

    listPlayingCards = Array<Node>();

    protected onLoad(): void {
        this.isTouchEnabled = true;

        // Touch event
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onDestroy() {
      input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(event: EventTouch) {
        console.log('onTouchStart');

        if (!this.isTouchEnabled) {
            return;
        }

        // Get start point
        const screenPos = event.getLocation()

        for (let i = this.listPlayingCards.length - 1 ; i > -1 ; i--) {
            const spcard = this.listPlayingCards[i];
            const transform = spcard.getComponent(UITransform)
            const ischeck = transform.hitTest(screenPos)
            if (ischeck && this.numberCardsSelected < 3) {
                this.isTouchEnabled = false;
                this.numberCardsSelected++;

                const numberCard = parseInt(spcard.name);
                const screenSize = view.getDesignResolutionSize();
                tween(spcard)
                    .to(2, { 
                        position: new Vec3((19 + 95 * (this.numberCardsSelected - 1)) * 2 - screenSize.width / 2, 290 * 2 - screenSize.height / 2, 0),
                        angle: 0
                    })
                    .call(() => {
                        this.changeCard(spcard, numberCard);
                    })
                    .start();
                break;
            }
        }
    }

    getRandomNumberBetweenMin(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

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

    changeCard(spcard: Node, numberCard: number) {
        if (this.numberCardsSelected == 1) {
            this.idCard1 = this.getRandomNumberBetweenMin(25, 56);
            this.changeDisplayCardImage(spcard, `${this.idCard1}`);
            this.lblThongbao.string = "Xin mời bạn chọn lá bài thứ hai.";
        }
        if (this.numberCardsSelected == 2) {
            while (!this.flag) {
                this.idCard2 = this.getRandomNumberBetweenMin(25, 56);
                if (this.idCard2 != this.idCard1) {
                    break;
                }
            }
            this.changeDisplayCardImage(spcard, `${this.idCard2}`);
            this.lblThongbao.string = "Xin mời bạn chọn lá bài thứ ba.";
        }
        if (this.numberCardsSelected == 3) {
            while (!this.flag) {
                this.idCard3 = this.getRandomNumberBetweenMin(25, 56);
                if (this.idCard3 != this.idCard1 && this.idCard3 != this.idCard2) {
                    break;
                }
            }
            this.changeDisplayCardImage(spcard, `${this.idCard3}`);
            this.lblThongbao.string = "Xin mời bạn xem quẻ bói của mình.";
        }
        this.isTouchEnabled = true;
    }

    start() {

        const contentSize = this.card1.getComponent(UITransform).contentSize;

        const tween1 = tween(this.card1)
            .to(0.3, { position: new Vec3(0, -contentSize.height / 2 - 10, 0) })
            .call(() => {
                this.card1.setSiblingIndex(1000);
            })
            .to(0.3, { position: new Vec3(0, 0, 0) })
            .delay(0.1)
            .to(0.3, { position: new Vec3(0, contentSize.height / 2 + 10, 0) })
            .call(() => {
                //this.card1.setSiblingIndex(0);
            })
            .to(0.3, { position: new Vec3(0, 0, 0) })
            .delay(0.1)

        tween(this.card1).repeatForever(tween1).start();

        const tween2 = tween(this.card2)
            .to(0.3, { position: new Vec3(0, contentSize.height / 2 + 10, 0) })
            .call(() => {
                // this.card2.setSiblingIndex(1000);
            })
            .to(0.3, { position: new Vec3(0, 0, 0) })
            .delay(0.1)
            .to(0.3, { position: new Vec3(0, -contentSize.height / 2 - 10, 0) })
            .call(() => {   
                this.card2.setSiblingIndex(1000);
            })
            .to(0.3, { position: new Vec3(0, 0, 0) })
            .delay(0.1)

        tween(this.card2).repeatForever(tween2).start();

        if (GameManager.instance.getCheckMale()) {
            this.scheduleOnce(this.stopEffectTraobai, 0.7 * 7);
        } else {
            this.scheduleOnce(this.stopEffectTraobai, 0.7 * 9);
        }
    }

    stopEffectTraobai() {
        this.unschedule(this.stopEffectTraobai);
        this.lblGioithieu.active = false;
        Tween.stopAllByTarget(this.card1);
        Tween.stopAllByTarget(this.card2);

        this.card1.setPosition(new Vec3(0, 0, 0));
        this.card2.setPosition(new Vec3(0, 0, 0));

        const contentSize = this.card1.getComponent(UITransform).contentSize;

        tween(this.card1)
            .to(0.5, { angle: 90 })
            .to(0.5, { position: new Vec3(-contentSize.width / 4 - 40, 0, 0) })
            .to(0.5, { position: new Vec3(0, 0, 0) })
            .call(() => {
                // remove card
                this.removeCard();
            })
            .start();

        tween(this.card2)
            .to(0.5, { angle: 90 })
            .to(0.5, { position: new Vec3(contentSize.width / 4 + 40, 0, 0) })
            .to(0.5, { position: new Vec3(0, 0, 0) })
            .start();
    }

    removeCard() {
        Tween.stopAllByTarget(this.card1);
        Tween.stopAllByTarget(this.card2);

        this.card1.destroy();
        this.card2.destroy();

        this.isTouchEnabled = false;

        this.schedule(this.effectsCards, 0.1);
    }

    effectsCards() {
        this.numberCards++;
        this.zCards++;
        this.tagCards++;
        this.angleCards = this.angleCards + 5;

        const screenSize = view.getDesignResolutionSize();

        if (this.numberCards < 33) {

            const quebai = new Node()
            quebai.layer = Layers.Enum.UI_2D
            quebai.name = `${this.tagCards}`

            const sprite = quebai.addComponent(Sprite)
            sprite.spriteFrame = this.queSpriteFrame

            quebai.setPosition(new Vec3(0, -95 * 2, 0))
            quebai.setRotationFromEuler(new Vec3(0, 0, this.angleCards))
            quebai.getComponent(UITransform).setAnchorPoint(new Vec2(0, 0))

            // add node to the container
            this.canvasNode.addChild(quebai)

            this.listPlayingCards.push(quebai);

            // CCSprite *quebai = [CCSprite spriteWithFile:@"Que.png"];
            // [quebai setPosition:CGPointMake(screenSize.width/2, screenSize.height/2 - 95)];
            // quebai.anchorPoint = CGPointMake(0, 0);
            // quebai.rotation = angleCards;
            // [self addChild:quebai z: 0 tag:tagCards];
        }
        else {
            this.unschedule(this.effectsCards);
            this.lblThongbao.node.active = true;
            this.schedule(this.changeThongbao, 2.5);

            // lblThongbao = [CCLabelTTF labelWithString:@"Xin bạn hãy thật thành tâm khi chọn các lá bài!" 
            //                             dimensions:CGSizeMake(160, 140) 
            //                                 alignment:CCTextAlignmentLeft  
            //                                 fontName:@"Marker Felt" 
            //                                 fontSize:16];
            // lblThongbao.position = CGPointMake(90, 50);
            // [self addChild:lblThongbao];
            
            // [self schedule:@selector(changeThongbao:) interval:2.5];
        }
    }

    changeThongbao() {
        this.unschedule(this.changeThongbao);
        this.lblThongbao.string = "Xin mời bạn chọn lá bài thứ nhất.";
        this.isTouchEnabled = true;
    }

    clickBack() {
        director.loadScene('SelectGenderCHTTScene');
    }

    clickNext() {
        if (this.numberCardsSelected > 2) {
            GameManager.instance.setCardByIndex(1, this.idCard1);
            GameManager.instance.setCardByIndex(2, this.idCard2);
            GameManager.instance.setCardByIndex(3, this.idCard3);

            director.loadScene('CHTTContentView');
        }
        else {
            console.log("Can chon them la bai");
        }
    }


    update(deltaTime: number) {
        
    }
}

