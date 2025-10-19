import { _decorator, Component, Layers, Node, Sprite, SpriteFrame, tween, UITransform, Vec3, screen, view, resources } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BoiNgayPlayScene')
export class BoiNgayPlayScene extends Component {

    @property(Node)
    canvasNode: Node = null

    @property(SpriteFrame)
    queSpriteFrame: SpriteFrame = null

    @property(Node)
    xapBaiNode: Node = null

    numberCardsDuoiFliped = 0;
		flagNext = false;
		idDoi1 = 0;
		idDoi2 = 0;
		idDoi3 = 0;

    demox = 162;
		demoy = 350;
		demi = 1;
		demj = 1;
		demPTMang = 1000;

    demLat = 0;

    arrCards = []; //mang luu 52 so ngau nhien khac nhau tu 5-56
		arrSPCardsTren = [];  // luu cac quan bai tren
		arrVTCardTren = []; // luu vi tri cac quan bai tren
		arrSPCardsFlipTren = [];// luu cac la bai da lat o tren
		arrSPcardsDuoi = []; // luu cac quan bai duoi
		arrSPCardsDuoiLai = []; //luu cac quan bai duoi de tim lai cac doi

    start() {
      this.schedule(this.effectChiabai, 0.2)
    }

    protected onLoad(): void {
      this.unschedule(this.update)
    }

    // update(deltaTime: number) {
    //   // [self unscheduleUpdate];
    //   // int i = 0;
    //   // for ( ; i < [arrSPCardsFlipTren count] ; i++) {
    //   //   CCSprite *spCard = [arrSPCardsFlipTren objectAtIndex:i];
    //   //   if ([self checkOK:spCard]) {
    //   //     break;
    //   //   }
    //   // }
    //   // if (i == [arrSPCardsFlipTren count]) {
    //   //   [self schedule:@selector(effectFlipCard:) interval:1];
    //   // }
    //   console.log(`update: ${deltaTime}`)
    //   this.unschedule(this.update)
    //   let i = 0;
    //   for (; i < this.arrSPCardsFlipTren.length; i++) {
    //     const spCard = this.arrSPCardsFlipTren[i]
    //     if (this.checkOK(spCard)) {
    //       break;
    //     }
    //   }

    //   if (i == this.arrSPCardsFlipTren.length) {
    //     this.schedule(this.effectFlipCard, 1)
    //   }
    // }

    createNewCardNode(tag: number, cardPos: Vec3) {
      console.log(`createNewCardNode: ${tag}`)
      const newNode = new Node()
      newNode.layer = Layers.Enum.UI_2D
      newNode.name = `${tag}`

      const sprite = newNode.addComponent(Sprite)
      sprite.spriteFrame = this.queSpriteFrame

      newNode.setScale(new Vec3(0.55, 0.55, 0.55))
      newNode.setPosition(cardPos)

      // add node to the container
      this.canvasNode.addChild(newNode)

      return newNode;
    }

    createNewCardNodeWithEffect(tag: number, moveTime: number, startPos: Vec3, endPos: Vec3) {
      const newNode = this.createNewCardNode(tag, startPos)

      // create animation
      tween(newNode).to(moveTime, endPos).start()

      return newNode
    }

    createNewCardNodeFromResource(imageNamed: string) {
      const newNode = new Node()
      newNode.layer = Layers.Enum.UI_2D
      // newNode.name = `${tag}`
      
      const sprite = newNode.addComponent(Sprite)

      // Load ảnh từ thư mục resources/images
      resources.load(`${imageNamed}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
          if (err) {
              console.error('Lỗi khi load ảnh:', err);
              return;
          }

          // Gắn spriteFrame vào Sprite component
          sprite.getComponent(Sprite).spriteFrame = spriteFrame;

          // Tùy chỉnh kích thước node theo kích thước ảnh
          const uiTransform = newNode.getComponent(UITransform);
          uiTransform.setContentSize(spriteFrame.width, spriteFrame.height);
      });

      return newNode;
    
    }

    effectChiabai() {
      const startPos = this.xapBaiNode.getPosition()
      const screenSize = view.getDesignResolutionSize()
      console.log(`screenSize: ${screenSize.width} ${screenSize.height}`)

      if (this.demi <= 7 && this.demPTMang < 1028) {
        if (this.demj <= this.demi) {
          // create new sprite node
          this.createNewCardNodeWithEffect(this.demPTMang, 0.2, 
            startPos, 
            new Vec3((this.demox + 46 * (this.demj - 1)) * 2 - screenSize.width / 2, this.demoy * 2 - screenSize.height / 2, 0)
          )

          this.demj++;
			    this.demPTMang++;
        }
        else {
          this.demj = 1;
          this.demox = this.demox - 23;
          this.demoy = this.demoy - 20;
          this.demi++;
          // create new node
          // create new sprite node
          this.createNewCardNodeWithEffect(this.demPTMang, 0.2, 
            startPos, 
            new Vec3((this.demox + 46 * (this.demj - 1)) * 2 - screenSize.width / 2, this.demoy * 2 - screenSize.height / 2, 0)
          )

          this.demj++;
			    this.demPTMang++;
        }
      }
      else {
        this.unschedule(this.effectChiabai)

        // sinh random arr 52 item khac nhau tu 5 den 56
        while(this.arrCards.length < 52) {
            const idCardTemp = this.getRandomNumberBetweenMin(5, 56);
            if (this.arrCards.indexOf(idCardTemp) === -1) {
                this.arrCards.push(idCardTemp);
            }
        }

        let dem = 0;
        // create quan bai tren
        let ox = 185;
        let oy = 370;

        for (let i = 1; i <= 7; i++) {
          ox = ox - 23;
          oy = oy - 20;
          for (let j = 1; j <= i; j++) {
            const cardPos = new Vec3((ox + 46*(j-1)) * 2 - screenSize.width / 2, oy * 2 - screenSize.height / 2, 0)
            const newCardNode = this.createNewCardNode(this.arrCards[dem], cardPos);

            this.arrSPCardsTren.push(newCardNode);
            this.arrVTCardTren.push(dem)
            
            //NSLog(@"tag card tren %i%i = %i", i,j, card.tag);
            dem++;
          }
        }

        // tao cac quan bai duoi
        for (let i = 1; i <= 24; i++) {
          const cardPos = new Vec3(0, 132 * 2 - screenSize.height / 2, 0)
          const newCardNode = this.createNewCardNode(this.arrCards[dem], cardPos)
          this.arrSPcardsDuoi.push(newCardNode)
          dem++;
          //NSLog(@"tag card duoi = %i", card.tag);
        }

        //remove cac bai tam
        for (let i = 1000; i < 1028; i++) {
          const cardNode = this.canvasNode.getChildByName(`${i}`)
          if (cardNode) {
            this.canvasNode.removeChild(cardNode)
          }
        }
        this.demLat = 21;
        this.schedule(this.effectLat7Quancuoi, 0.5)
      }
    }

    getRandomNumberBetweenMin(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    effectLat7Quancuoi() {
      console.log(`effectLat7Quancuoi: ${this.demLat}`)
      if (this.demLat <= 27) {
        // const newCardNode = this.createNewCardNodeFromResource()
        
        // CCSprite *spriteCard = [arrSPCardsTren objectAtIndex:demLat];
        // CCTexture2D *texture2D = [[CCTexture2D alloc] initWithImage:[UIImage imageNamed:[NSString stringWithFormat:@"%i.png",spriteCard.tag]]];
        // [spriteCard setTexture: texture2D];
        // [arrSPCardsFlipTren addObject:spriteCard];

        const spriteCardNode = this.arrSPCardsTren[this.demLat]
        // change texture
        // Load ảnh từ thư mục resources/images
        console.log(`spriteCardNode.name: ${spriteCardNode.name}`)
        resources.load(`${spriteCardNode.name}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.error('Lỗi khi load ảnh:', err);
                return;
            }

            // Gắn spriteFrame vào Sprite component
            spriteCardNode.getComponent(Sprite).spriteFrame = spriteFrame;

            // Tùy chỉnh kích thước node theo kích thước ảnh
            // const uiTransform = newNode.getComponent(UITransform);
            // uiTransform.setContentSize(spriteFrame.width, spriteFrame.height);
        });
      
        this.arrSPCardsFlipTren.push(spriteCardNode)
        this.demLat++;
      }
      else {
        this.unschedule(this.effectLat7Quancuoi)
        this.schedule(this.effectFlipCard, 1.0)
      }
    }

    // lat quan bai duoi tu duoi len
    effectFlipCard() {
      console.log(`effectFlipCard`)
      this.unschedule(this.effectFlipCard)
      this.numberCardsDuoiFliped++;
      const screenSize = view.getDesignResolutionSize()

      if (this.numberCardsDuoiFliped < 25) {
        // self.isTouchEnabled = NO;
        // CCSprite *spCard = [arrSPcardsDuoi objectAtIndex:0];
        // //NSLog(@"so bai lat = %i tag bai dc lat %i", numberCardsDuoiFliped, spCard.tag);
        // CCMoveTo* move = [CCMoveTo actionWithDuration:1 position:CGPointMake(screenSize.width/2, 205)];
        // CCCallFunc* callChangeImage = [CCCallFuncN actionWithTarget:self selector:@selector(chageImage)];
        // CCMoveTo* moveback = [CCMoveTo actionWithDuration:1 position:CGPointMake(screenSize.width/2, 132)];
        // CCCallFunc* call = [CCCallFuncN actionWithTarget:self selector:@selector(startUpdate:)];
        // CCSequence* sequen = [CCSequence actions:move,callChangeImage,moveback,call, nil];
        // [spCard runAction:sequen];

        const spCard = this.arrSPcardsDuoi[0]
        tween(spCard)
          .to(1, new Vec3(0, 205 * 2 - screenSize.height / 2, 0))
          .call(() => {
            this.changeImage()
          })
          .to(1, new Vec3(0, 132 * 2 - screenSize.height / 2, 0))
          .call(() => {
            // TOD: start update
            this.startUpdate()
          }).start()
      }
      else {
        // Huy cac quan bai con lai
        // for (int i = 0; i < [arrVTCardTren count] ; i++) {
        //   int indextemp = [[arrVTCardTren objectAtIndex:i] intValue];
        //   CCSprite *spCard = [arrSPCardsTren objectAtIndex:indextemp];
        //   [self removeChild:spCard cleanup:NO];
        // }
        for (let i = 0; i < this.arrVTCardTren.length; i++) {
          const indextemp = this.arrVTCardTren[i]
          const spCard = this.canvasNode.getChildByName(`${indextemp}`)
          if (spCard) {
            this.canvasNode.removeChild(spCard)
          }
        }
        
        // TODO: check cac doi bai trung nhau
        // [self showDoiBaiTrungNhau];
      }

    }

    // check xem phan tren co quan nao thoa man ko neu ko thi lat tiep
    startUpdate() {
      // self.isTouchEnabled = YES;
	    // [self scheduleUpdate];
    }

    //hieu ung lat quan bai va chuyen doi vi tri cac quan bai trong phan duoi
    changeImage() {
      // CCSprite *spCard = [arrSPcardsDuoi objectAtIndex:0];
      // CCTexture2D *texture2D = [[CCTexture2D alloc] initWithImage:[UIImage imageNamed:[NSString stringWithFormat:@"%i.png",spCard.tag]]];
      // [spCard setTexture: texture2D];
      // [self removeChild:spCard cleanup:NO];
      // [self addChild:spCard];
      // for (int i = 1; i <= [arrSPcardsDuoi count]; i++) {
      //   [arrSPcardsDuoi exchangeObjectAtIndex:0 withObjectAtIndex:[arrSPcardsDuoi count] - i];
      // }

      const spCard = this.arrSPcardsDuoi[0];
      // change texture
      // Load ảnh từ thư mục resources/images
      console.log(`spriteCardNode.name: ${spCard.name}`)
      resources.load(`${spCard.name}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
          if (err) {
              console.error('Lỗi khi load ảnh:', err);
              return;
          }

          // Gắn spriteFrame vào Sprite component
          spCard.getComponent(Sprite).spriteFrame = spriteFrame;
          

          // Tùy chỉnh kích thước node theo kích thước ảnh
          // const uiTransform = newNode.getComponent(UITransform);
          // uiTransform.setContentSize(spriteFrame.width, spriteFrame.height);
      });

      // Di chuyển lá đầu xuống cuối mảng
      const fistSpCard = this.arrSPcardsDuoi[0];
      this.arrSPcardsDuoi.splice(0, 1);         // Xóa phần tử đầu tiên
      this.arrSPcardsDuoi.push(fistSpCard);     // Thêm nó xuống cuối mảng

    }

    checkOK(spCard: Node) {
      const spCardD =  this.arrSPcardsDuoi[this.arrSPcardsDuoi.length - 1];
      const idCardD = parseInt(spCardD.name);
      const idCardT = parseInt(spCard.name);
      if (Math.abs((idCardD - 1)/4 - (idCardT-1)/4) == 1 || Math.abs((idCardD - 1)/4 - (idCardT-1)/4) == 12) {
        return true;
      }
      else {
        return false;
      }
    }

}

