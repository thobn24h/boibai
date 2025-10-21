import { 
  _decorator, Component, Layers, Node, Sprite, SpriteFrame, tween, UITransform, Vec3, screen, view, resources, 
  input, Input, EventTouch 
} from 'cc';

const { ccclass, property } = _decorator;

@ccclass('BoiNgayPlayScene')
export class BoiNgayPlayScene extends Component {

    @property(Node)
    canvasNode: Node = null

    @property(SpriteFrame)
    queSpriteFrame: SpriteFrame = null

    @property(Node)
    xapBaiNode: Node = null

    xapBaiPos: Vec3 = Vec3.ZERO

    isUpdateEnable: boolean = false;
    isTouchEnabled: boolean = false;

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
    demFind = 0;
    demsodoidachon = 0;

    demFindLai = 0;

    arrCards = Array<number>(); //mang luu 52 so ngau nhien khac nhau tu 5-56
		arrSPCardsTren = Array<Node>();  // luu cac quan bai tren ( mảng các quân bài trên )
		arrVTCardTren = Array<number>(); // luu vi tri cac quan bai tren ( vị trí từ 0 -> n của các quân bài trên )
		arrSPCardsFlipTren = [];// luu cac la bai da lat o tren
		arrSPcardsDuoi = Array<Node>(); // luu cac quan bai duoi
		arrSPCardsDuoiLai = Array<Node>(); //luu cac quan bai duoi de tim lai cac doi

    getCardName(tag: number) {
      const base = Math.floor(tag / 4) + 1
      const type = tag % 4
      
      let cardName = `${base}`
      if (base == 11) {
        cardName = 'J'
      } else if (base == 12) {
        cardName = 'Q'
      } else if (base == 13) {
        cardName = 'K'
      } else if (base == 14) {
        cardName = 'A'
      }

      if (type == 1) {
        return `${cardName}♦`
      } else if (type == 2) {
        return `${cardName}♥`
      } else if (type == 3) {
        return `${cardName}♣`
      } else if (type == 0) {
        return `${cardName}♠`
      }

    }

    getCardListLog(cardNodes: Array<Node>) {
      let strData = cardNodes.map((node) => { this.getCardName(parseInt(node.name)) }).join(', ')
      return strData
    }

    logCardData(title: String ) {
      console.log(`--------------- ${title} ---------------`)
      console.log(`arrSPCardsFlipTren: ${this.getCardListLog(this.arrSPCardsFlipTren)}`)
      console.log(`arrSPcardsDuoi: ${this.getCardListLog(this.arrSPcardsDuoi)}`)
    }

    start() {
      this.schedule(this.effectChiabai, 0.2)
    }

    protected onLoad(): void {
      this.xapBaiPos = this.xapBaiNode.getPosition()
      this.unschedule(this.update)

      // Touch event
      input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
      // input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
      // input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
      // input.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

    }

    onDestroy() {
      input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
      // input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
      // input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
      // input.off(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchStart(event: EventTouch) {

      if (!this.isTouchEnabled) {
        return;
      }

      // Get start point
      const screenPos = event.getLocation()

      for (let i = this.arrSPCardsFlipTren.length - 1 ; i > -1 ; i--) {
        const spcard = this.arrSPCardsFlipTren[i];
        const transform = spcard.getComponent(UITransform)
        const ischeck = transform.hitTest(screenPos)
        if (ischeck) {
          //NSLog(@"tag bai click %i",spcard.tag);
          if (this.checkOK(spcard)) {
            this.isTouchEnabled = false;
            const screenSize = view.getDesignResolutionSize()
            
            // NSLog(@" la bai % i thoa man", spcard.tag);
            
            // CCCallFuncND *addCard = [CCCallFuncND actionWithTarget:self 
            //                         selector:@selector(addCardR:data:) 
            //                           data:(void *)spcard];
            
            // CCMoveTo *move1 = [CCMoveTo actionWithDuration:1 position:CGPointMake(screenSize.width/2, screenSize.height/2)];
            // CCScaleTo *scale1 = [CCScaleTo actionWithDuration:1 scale:1];
            // CCSpawn *actionZoomOut = [CCSpawn actions:move1, scale1, nil];
        
            
            // CCMoveTo *move2 = [CCMoveTo actionWithDuration:1 position:CGPointMake(screenSize.width/2, 132)];
            // CCScaleTo *scale2 = [CCScaleTo actionWithDuration:1 scale:0.55];
            // CCSpawn *actionZoomIn = [CCSpawn actions:move2, scale2, nil];
            
            // CCCallFuncND* call = [CCCallFuncND actionWithTarget:self 
            //                        selector:@selector(effectMoveDone:data:) 
            //                          data:(void *)spcard];
            
            // CCSequence *sequence = [CCSequence actions:addCard, actionZoomOut, actionZoomIn,call, nil];
            // [spcard runAction:sequence];

            tween(spcard)
              .call(() => { this.addCardR(spcard); })
              .to(1, { position: new Vec3(0, 0, 0), scale: new Vec3(1, 1, 1) })
              .to(1, { position: this.xapBaiPos, scale: new Vec3(0.55, 0.55, 0.55)})  // new Vec3(0, 132 * 2 - screenSize.height / 2, 0)
              .call(() => { this.effectMoveDone(spcard); })
              .start()
          
            break;
          }
        }
      }

    }

    // add lai de no hien thi len phia tren
    addCardR(spCard: Node) {
      // CCSprite *spCard = (CCSprite *) data;
      // [self removeChild:spCard cleanup:NO];
      // [self addChild:spCard];
      spCard.setSiblingIndex(1000);
    }

    effectMoveDone(spCard: Node) {
      let vtCard;
      const idcard = parseInt(spCard.name)
      for (let i = 0; i < this.arrSPCardsTren.length; i++) {
        const spC = this.arrSPCardsTren[i];
        if (idcard == parseInt(spC.name)) {
          vtCard = i;
          break;
        }
      }

      //NSLog(@"VT card = %i", vtCard);
      this.checkViewCard(vtCard);
      // [arrSPCardsFlipTren removeObject:spCard];
      // [arrSPcardsDuoi addObject:spCard];

      this.arrSPCardsFlipTren = this.arrSPCardsFlipTren.filter((card) => card.name != spCard.name)
      this.arrSPcardsDuoi.push(spCard)

      this.isTouchEnabled = true;
      this.isUpdateEnable = true;
      // [self scheduleUpdate];

      this.logCardData('effectMoveDone')
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

    checkViewCard(idCardPR: number) {
      if (idCardPR > 20) {
        let i = 0;
        for (; i < this.arrVTCardTren.length; i++) {
          if (idCardPR + 1 == this.arrVTCardTren[i]) {
            break;
          }
        }
        if (i == this.arrVTCardTren.length && idCardPR != 27) {
          //NSLog(@"loai bo VT %i", idCardPR - 6);
          const spCard = this.arrSPCardsTren[idCardPR - 6];
          // change display image
          this.changeDisplayCardImage(spCard, spCard.name)
          // 
          this.arrSPCardsFlipTren.push(spCard);
        }
        let j = 0;
        for (; j < this.arrVTCardTren.length; j++) {
          if (idCardPR - 1 == this.arrVTCardTren[j]) {
            break;
          }
        }
        if (j == this.arrVTCardTren.length && idCardPR != 21) {
          //NSLog(@"loai bo VT %i", idCardPR - 7);
          const spCard = this.arrSPCardsTren[idCardPR - 7];
          this.changeDisplayCardImage(spCard, spCard.name)
          this.arrSPCardsFlipTren.push(spCard);
        }
      }
      else {
        if (idCardPR > 14) {
          let i = 0;
          for (; i < this.arrVTCardTren.length; i++) {
            if (idCardPR + 1 == this.arrVTCardTren[i]) {
              break;
            }
          }
          if (i == this.arrVTCardTren.length && idCardPR != 20) {
            //NSLog(@"loai bo VT %i", idCardPR - 5);
            const spCard = this.arrSPCardsTren[idCardPR - 5];
            this.changeDisplayCardImage(spCard, spCard.name)
            this.arrSPCardsFlipTren.push(spCard);
            
          }
          let j = 0;
          for (; j < this.arrVTCardTren.length; j++) {
            if (idCardPR - 1 == this.arrVTCardTren[j]) {
              break;
            }
          }

          if (j == this.arrVTCardTren.length && idCardPR != 15) {
            //NSLog(@"loai bo VT %i", idCardPR - 6);
            const spCard = this.arrSPCardsTren[idCardPR - 6];
            this.changeDisplayCardImage(spCard, spCard.name)
            this.arrSPCardsFlipTren.push(spCard);
          }
        }
        else {
          if (idCardPR > 9) {
            let i = 0;
            for (; i < this.arrVTCardTren.length; i++) {
              if (idCardPR + 1 == this.arrVTCardTren[i]) {
                break;
              }
            }
            if (i == this.arrVTCardTren.length && idCardPR != 14) {
              //NSLog(@"loai bo VT %i", idCardPR - 4);
              const spCard = this.arrSPCardsTren[idCardPR - 4];
              this.changeDisplayCardImage(spCard, spCard.name)
              this.arrSPCardsFlipTren.push(spCard);
            }
            let j = 0;
            for (; j < this.arrVTCardTren.length; j++) {
              if (idCardPR - 1 == this.arrVTCardTren[j]) {
                break;
              }
            }
            if (j == this.arrVTCardTren.length && idCardPR != 10) {
              //NSLog(@"loai bo VT %i", idCardPR - 5);
              const spCard = this.arrSPCardsTren[idCardPR - 5];
              this.changeDisplayCardImage(spCard, spCard.name)
              this.arrSPCardsFlipTren.push(spCard);
            }
          }
          else {
            
            if (idCardPR > 5) {
              let i = 0;
              for (; i < this.arrVTCardTren.length; i++) {
                if (idCardPR + 1 == this.arrVTCardTren[i]) {
                  break;
                }
              }
              if (i == this.arrVTCardTren.length && idCardPR != 9) {
                //NSLog(@"loai bo VT %i", idCardPR - 3);
                const spCard = this.arrSPCardsTren[idCardPR - 3];
                this.changeDisplayCardImage(spCard, spCard.name)
                this.arrSPCardsFlipTren.push(spCard);
              }
              let j = 0;
              for (; j < this.arrVTCardTren.length; j++) {
                if (idCardPR - 1 == this.arrVTCardTren[j]) {
                  break;
                }
              }
              if (j == this.arrVTCardTren.length && idCardPR != 6) {
                //NSLog(@"loai bo VT %i", idCardPR - 4);
                const spCard = this.arrSPCardsTren[idCardPR - 4];
                this.changeDisplayCardImage(spCard, spCard.name)
                this.arrSPCardsFlipTren.push(spCard);
              }
            }
            else {
              if (idCardPR > 2) {
                let i = 0;
                for (; i < this.arrVTCardTren.length; i++) {
                  if (idCardPR + 1 == this.arrVTCardTren[i]) {
                    break;
                  }
                }
                if (i == this.arrVTCardTren.length && idCardPR != 5) {
                  //NSLog(@"loai bo VT %i", idCardPR - 2);
                  const spCard = this.arrSPCardsTren[idCardPR - 2];
                  this.changeDisplayCardImage(spCard, spCard.name)
                  this.arrSPCardsFlipTren.push(spCard);
                }
                let j = 0;
                for (; j < this.arrVTCardTren.length; j++) {
                  if (idCardPR - 1 == this.arrVTCardTren[j]) {
                    break;
                  }
                }
                if (j == this.arrVTCardTren.length && idCardPR != 3) {
                  //NSLog(@"loai bo VT %i", idCardPR - 3);
                  const spCard = this.arrSPCardsTren[idCardPR - 3];
                  this.changeDisplayCardImage(spCard, spCard.name)
                  this.arrSPCardsFlipTren.push(spCard);
                }
              }
              else {
                if (idCardPR > 0) {
                  let i = 0;
                  for (; i < this.arrVTCardTren.length; i++) {
                    if (idCardPR + 1 == this.arrVTCardTren[i]) {
                      break;
                    }
                  }
                  if (i == this.arrVTCardTren.length && idCardPR != 2) {
                    //NSLog(@"loai bo VT %i", idCardPR - 1);
                    const spCard = this.arrSPCardsTren[idCardPR - 1];
                    this.changeDisplayCardImage(spCard, spCard.name)
                    this.arrSPCardsFlipTren.push(spCard);
                  }
                  let j = 0;
                  for (; j < this.arrVTCardTren.length; j++) {
                    if (idCardPR - 1 == this.arrVTCardTren[j]) {
                      break;
                    }
                  }
                  if (j == this.arrVTCardTren.length && idCardPR != 1) {
                    //NSLog(@"loai bo VT %i", idCardPR - 2);
                    const spCard = this.arrSPCardsTren[idCardPR - 2];
                    this.changeDisplayCardImage(spCard, spCard.name)
                    this.arrSPCardsFlipTren.push(spCard);
                  }
                }
              }
    
            }
    
          }
        }
    
      }
      // [arrVTCardTren removeObject:[NSNumber numberWithInt:idCardPR]];
      this.arrVTCardTren = this.arrVTCardTren.filter(item => item == idCardPR)
    }


    update(deltaTime: number) {
      if (!this.isUpdateEnable) {
        return
      }

      // [self unscheduleUpdate];
      // int i = 0;
      // for ( ; i < [arrSPCardsFlipTren count] ; i++) {
      //   CCSprite *spCard = [arrSPCardsFlipTren objectAtIndex:i];
      //   if ([self checkOK:spCard]) {
      //     break;
      //   }
      // }
      // if (i == [arrSPCardsFlipTren count]) {
      //   [self schedule:@selector(effectFlipCard:) interval:1];
      // }
      // console.log(`update: ${deltaTime}`)
      // this.unschedule(this.update)
      if (this.isUpdateEnable) {
        this.isUpdateEnable = false;
      }

      let i = 0;
      for (; i < this.arrSPCardsFlipTren.length; i++) {
        const spCard = this.arrSPCardsFlipTren[i]
        if (this.checkOK(spCard)) {
          break;
        }
      }

      if (i == this.arrSPCardsFlipTren.length) {
        this.schedule(this.effectFlipCard, 1)
      }
    }

    createNewCardNode(tag: number, cardPos: Vec3) {
      // console.log(`createNewCardNode: ${tag}`)
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
      const startPos = this.xapBaiPos
      const screenSize = view.getDesignResolutionSize()
      // console.log(`screenSize: ${screenSize.width} ${screenSize.height}`)

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
          // const cardPos = new Vec3(0, 132 * 2 - screenSize.height / 2, 0)
          const cardPos = this.xapBaiPos
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
      // console.log(`effectLat7Quancuoi: ${this.demLat}`)
      if (this.demLat <= 27) {
        const spriteCardNode = this.arrSPCardsTren[this.demLat]
        // change texture
        // Load ảnh từ thư mục resources/images
        // console.log(`spriteCardNode.name: ${spriteCardNode.name}`)
        resources.load(`${spriteCardNode.name}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.error('Lỗi khi load ảnh:', err);
                return;
            }

            // Gắn spriteFrame vào Sprite component
            spriteCardNode.getComponent(Sprite).spriteFrame = spriteFrame;
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
      // console.log(`effectFlipCard`)
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

        this.isTouchEnabled = false;

        const cardPos = this.xapBaiPos
        const cardSize = this.xapBaiNode.getComponent(UITransform).contentSize

        const spCard = this.arrSPcardsDuoi[0]
        tween(spCard)
          // .by(1, new Vec3(0, 205 * 2 - screenSize.height / 2, 0))
          .by(1, new Vec3(0, cardSize.height / 2, 0))
          .call(() => {
            this.changeImage()
          })
          // .to(1, new Vec3(0, 132 * 2 - screenSize.height / 2, 0))
          .to(1, cardPos)
          .call(() => {
            // start update
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
        
        // check cac doi bai trung nhau
        this.showDoiBaiTrungNhau()
      }

    }

    // check xem phan tren co quan nao thoa man ko neu ko thi lat tiep
    startUpdate() {
      // self.isTouchEnabled = YES;
	    // [self scheduleUpdate];
      // this.schedule(this.update, 0)
      
      this.isTouchEnabled = true;
      this.isUpdateEnable = true;
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
      // console.log(`spriteCardNode.name: ${spCard.name}`)
      resources.load(`${spCard.name}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
          if (err) {
              console.error('Lỗi khi load ảnh:', err);
              return;
          }

          // Gắn spriteFrame vào Sprite component
          spCard.getComponent(Sprite).spriteFrame = spriteFrame;
      });

      // Di chuyển lá đầu xuống cuối mảng
      const firstSpCard = this.arrSPcardsDuoi[0];
      this.arrSPcardsDuoi.splice(0, 1);         // Xóa phần tử đầu tiên
      this.arrSPcardsDuoi.push(firstSpCard);    // Thêm nó xuống cuối mảng

      // move to first layer
      firstSpCard.setSiblingIndex(1000)

    }

    checkOK(spCard: Node) {
      const spCardD =  this.arrSPcardsDuoi[this.arrSPcardsDuoi.length - 1];
      const idCardD = parseInt(spCardD.name);
      const idCardT = parseInt(spCard.name);
      
      // tính bậc (0-12)
      const rankD = Math.floor((idCardD - 1) / 4);
      const rankT = Math.floor((idCardT - 1) / 4);

      const diff = Math.abs(rankD - rankT);

      if (diff === 1 || diff === 12) {
        console.log(`idCardD: ${this.getCardName(idCardD)} - idCardT: ${this.getCardName(idCardT)} - RankD: ${rankD} - RankT: ${rankT} - diff: ${diff} - ${(diff === 1 || diff === 12) ? 'TRUE' : 'FASE'}`)
        return true;
      } else {
          return false;
      }
    }

    showDoiBaiTrungNhau() {
      this.demFind = 0;
      this.schedule(this.findCardTrungNhau, 2.5)
    }

    findCardTrungNhau() {
      if (this.arrSPcardsDuoi.length % 2 != 0) {
        const spT = this.arrSPcardsDuoi[this.arrSPcardsDuoi.length / 2]
        this.canvasNode.removeChild(spT)
        this.arrSPcardsDuoi.splice(this.arrSPcardsDuoi.length / 2, 1)
      }

      if (this.demFind < this.arrSPcardsDuoi.length / 2) {
			
          const screenSize = view.getDesignResolutionSize()
          const sp1 = this.arrSPcardsDuoi[this.demFind];
          const sp2 = this.arrSPcardsDuoi[this.arrSPcardsDuoi.length - this.demFind - 1];
          
          const idsp1 = parseInt(sp1.name);
          const idsp2 = parseInt(sp2.name);
          if (((idsp1- 1)/4 == (idsp2-1)/4) && (idsp1 != idsp2)) {
            this.demsodoidachon++;
            switch (this.demsodoidachon) {
              case 1:
                this.idDoi1 = (idsp1 - 1)/4 + 1;
                break;
              case 2:
                this.idDoi2 = (idsp1 - 1)/4 + 1;
                break;
              case 3:
                this.idDoi3 = (idsp1 - 1)/4 + 1;
                break;
              default:
                break;
            }
            if (this.demsodoidachon < 4) {
              
              // CCMoveTo *move1 = [CCMoveTo actionWithDuration:1 position:CGPointMake(screenSize.width/2, screenSize.height/2)];
              // CCScaleTo *scale1 = [CCScaleTo actionWithDuration:1 scale:1];
              // CCSpawn *actionZoomOut1 = [CCSpawn actions:move1, scale1, nil];
              // CCDelayTime *delayTime1 = [CCDelayTime actionWithDuration:0.5f];
              // CCMoveTo *moveback1 = [CCMoveTo actionWithDuration:1 position:CGPointMake(20 + 62*demsodoidachon, 350)];
              // CCScaleTo *scaleback1 = [CCScaleTo actionWithDuration:1 scale:0.55];
              // CCSpawn *actionZoomIn1 = [CCSpawn actions:moveback1, scaleback1, nil];
              
              // CCSequence *sequence1 = [CCSequence actions:actionZoomOut1,delayTime1, actionZoomIn1, nil];
              // [sp1 runAction:sequence1];

              tween(sp1)
                .to(1, { 
                  position: new Vec3(0, 0, 0),
                  scale: new Vec3(1, 1, 1)
                })
                // Delay 0.5 giây
                .delay(0.5)
                // Di chuyển trở về vị trí ban đầu + scale nhỏ lại
                .to(1, { 
                    position: new Vec3((20 + 62 * this.demsodoidachon) * 2 - screenSize.width / 2, 350 * 2 - screenSize.height / 2, 0),
                    scale: new Vec3(0.55, 0.55, 1)
                })
                .start()

              
              // CCMoveTo *move2 = [CCMoveTo actionWithDuration:1 position:CGPointMake(screenSize.width/2 + 20, screenSize.height/2)];
              // CCScaleTo *scale2 = [CCScaleTo actionWithDuration:1 scale:1];
              // CCSpawn *actionZoomOut2 = [CCSpawn actions:move2, scale2, nil];
              // CCDelayTime *delayTime2 = [CCDelayTime actionWithDuration:0.5f];
              // CCMoveTo *moveback2 = [CCMoveTo actionWithDuration:1 position:CGPointMake(30 + 62*demsodoidachon, 350)];
              // CCScaleTo *scaleback2 = [CCScaleTo actionWithDuration:1 scale:0.55];
              // CCSpawn *actionZoomIn2 = [CCSpawn actions:moveback2, scaleback2, nil];
              
              // CCSequence *sequence2 = [CCSequence actions:actionZoomOut2,delayTime2, actionZoomIn2, nil];
              // [sp2 runAction:sequence2];

              // Tween cho sp2
              tween(sp2)
                // Zoom out + di chuyển ra giữa màn hình (lệch 20px)
                .to(1, { 
                    position: new Vec3(20 * 2, 0, 1),
                    scale: new Vec3(1, 1, 1)
                })
                // Dừng 0.5s
                .delay(0.5)
                // Zoom in + di chuyển về chỗ cũ
                .to(1, { 
                    position: new Vec3((30 + 62 * this.demsodoidachon) * 2 - screenSize.width / 2, 350 * 2 - screenSize.height / 2),
                    scale: new Vec3(0.55, 0.55, 1)
                })
                .start();
            }
            else {
              // CCMoveTo *move1 = [CCMoveTo actionWithDuration:1 position:CGPointMake(screenSize.width/2, screenSize.height/2)];
              // CCScaleTo *scale1 = [CCScaleTo actionWithDuration:1 scale:1];
              // CCSpawn *actionZoomOut1 = [CCSpawn actions:move1, scale1, nil];
              // CCDelayTime *delayTime1 = [CCDelayTime actionWithDuration:0.5f];
              // CCMoveTo *moveback1 = [CCMoveTo actionWithDuration:1 position:CGPointMake(20 + 62*(demsodoidachon - 3), 270)];
              // CCScaleTo *scaleback1 = [CCScaleTo actionWithDuration:1 scale:0.55];
              // CCSpawn *actionZoomIn1 = [CCSpawn actions:moveback1, scaleback1, nil];
              
              // CCSequence *sequence1 = [CCSequence actions:actionZoomOut1,delayTime1, actionZoomIn1, nil];
              // [sp1 runAction:sequence1];

              tween(sp1)
                .to(1, { 
                  position: new Vec3(0, 0, 0),
                  scale: new Vec3(1, 1, 1)
                })
                // Delay 0.5 giây
                .delay(0.5)
                // Di chuyển trở về vị trí ban đầu + scale nhỏ lại
                .to(1, { 
                    position: new Vec3((20 + 62 * (this.demsodoidachon - 3)) * 2 - screenSize.width / 2, 270 * 2 - screenSize.height / 2, 0),
                    scale: new Vec3(0.55, 0.55, 1)
                })
                .start()

              // CCMoveTo *move2 = [CCMoveTo actionWithDuration:1 position:CGPointMake(screenSize.width/2 + 20, screenSize.height/2)];
              // CCScaleTo *scale2 = [CCScaleTo actionWithDuration:1 scale:1];
              // CCSpawn *actionZoomOut2 = [CCSpawn actions:move2, scale2, nil];
              // CCDelayTime *delayTime2 = [CCDelayTime actionWithDuration:0.5f];
              // CCMoveTo *moveback2 = [CCMoveTo actionWithDuration:1 position:CGPointMake(30 + 62*(demsodoidachon - 3), 270)];
              // CCScaleTo *scaleback2 = [CCScaleTo actionWithDuration:1 scale:0.55];
              // CCSpawn *actionZoomIn2 = [CCSpawn actions:moveback2, scaleback2, nil];
              
              // CCSequence *sequence2 = [CCSequence actions:actionZoomOut2,delayTime2, actionZoomIn2, nil];
              // [sp2 runAction:sequence2];

              // Tween cho sp2
              tween(sp2)
                // Zoom out + di chuyển ra giữa màn hình (lệch 20px)
                .to(1, { 
                    position: new Vec3(20 * 2, 0, 1),
                    scale: new Vec3(1, 1, 1)
                })
                // Dừng 0.5s
                .delay(0.5)
                // Zoom in + di chuyển về chỗ cũ
                .to(1, { 
                    position: new Vec3((30 + 62 * (this.demsodoidachon - 3)) * 2 - screenSize.width / 2, 270 * 2 - screenSize.height / 2),
                    scale: new Vec3(0.55, 0.55, 1)
                })
                .start();

            }
          }
          else {
            
            if (idsp1 != idsp2) {
              // CCMoveTo *move1 = [CCMoveTo actionWithDuration:1 position:CGPointMake(screenSize.width/2, screenSize.height/2)];
              // CCScaleTo *scale1 = [CCScaleTo actionWithDuration:1 scale:1];
              // CCSpawn *actionZoomOut1 = [CCSpawn actions:move1, scale1, nil];
              // CCDelayTime *delayTime1 = [CCDelayTime actionWithDuration:0.5f];
              // CCCallFuncND* call1 = [CCCallFuncND actionWithTarget:self 
              //                       selector:@selector(removeChildCard1:data:) 
              //                         data:(void *)sp1];
              // CCSequence *sequence1 = [CCSequence actions:actionZoomOut1,delayTime1, call1, nil];
              // [sp1 runAction:sequence1];

              tween(sp1)
                .to(1, { 
                  position: new Vec3(0, 0, 0),
                  scale: new Vec3(1, 1, 1)
                })
                // Delay 0.5 giây
                .delay(0.5)
                // Di chuyển trở về vị trí ban đầu + scale nhỏ lại
                .call(function() {
                  this.removeChildCard1(sp1);
                })
                .start()
              
              
              // CCMoveTo *move2 = [CCMoveTo actionWithDuration:1 position:CGPointMake(screenSize.width/2 + 20, screenSize.height/2)];
              // CCScaleTo *scale2 = [CCScaleTo actionWithDuration:1 scale:1];
              // CCSpawn *actionZoomOut2 = [CCSpawn actions:move2, scale2, nil];
              // CCDelayTime *delayTime2 = [CCDelayTime actionWithDuration:0.5f];
              // CCCallFuncND* call2 = [CCCallFuncND actionWithTarget:self 
              //                       selector:@selector(removeChildCard2:data:) 
              //                         data:(void *)sp2];
              // CCSequence *sequence2 = [CCSequence actions:actionZoomOut2,delayTime2, call2, nil];
              // [sp2 runAction:sequence2];

              tween(sp2)
                .to(1, { 
                  position: new Vec3(20 * 2, 0, 0),
                  scale: new Vec3(1, 1, 1)
                })
                // Delay 0.5 giây
                .delay(0.5)
                // Di chuyển trở về vị trí ban đầu + scale nhỏ lại
                .call(function() {
                  this.removeChildCard2(sp2);
                })
                .start()

              // [arrSPCardsDuoiLai addObject:sp1];
              // [arrSPCardsDuoiLai addObject:sp2];

              this.arrSPCardsDuoiLai.push(sp1)
              this.arrSPCardsDuoiLai.push(sp2)

            }
            else {
              // CCMoveTo *move1 = [CCMoveTo actionWithDuration:1 position:CGPointMake(screenSize.width/2, screenSize.height/2)];
              // CCScaleTo *scale1 = [CCScaleTo actionWithDuration:1 scale:1];
              // CCSpawn *actionZoomOut1 = [CCSpawn actions:move1, scale1, nil];
              // CCCallFuncND* call1 = [CCCallFuncND actionWithTarget:self 
              //                       selector:@selector(removeChildCard1:data:) 
              //                         data:(void *)sp1];
              // CCSequence *sequence1 = [CCSequence actions:actionZoomOut1, call1, nil];
              // [sp1 runAction:sequence1];
              // [arrSPCardsDuoiLai addObject:sp1];
              
              tween(sp1)
                .to(1, { 
                  position: new Vec3(0, 0, 0),
                  scale: new Vec3(1, 1, 1)
                })
                // Delay 0.5 giây
                .delay(0.5)
                // Di chuyển trở về vị trí ban đầu + scale nhỏ lại
                .call(function() {
                  this.removeChildCard1(sp1);
                })
                .start()
            }
          }
          this.demFind++;
      }
      else {
        this.unschedule(this.findCardTrungNhau)
        // [self removeChildByTag:104 cleanup:YES];
        const xapBaiNode = this.canvasNode.getChildByName('104');
        if (xapBaiNode != null) {
          this.canvasNode.removeChild(xapBaiNode)
        }

        if (this.demsodoidachon < 2) { // neu nho hon 3 doi thi tim lai
          this.TimLaiDoiBaiTrungNhau()
        }
        else {
          // CCLabelTTF *lblThongbao = [CCLabelTTF labelWithString:@"Xin mời bạn xem quẻ bói." 
          //                       dimensions:CGSizeMake(300, 200) 
          //                       alignment:CCTextAlignmentCenter  
          //                       fontName:@"Marker Felt" 
          //                       fontSize:22];
          // lblThongbao.color = ccORANGE;
          // lblThongbao.position = CGPointMake(160, 150);
          // [self addChild:lblThongbao z:5];
          // flagNext = TRUE;
        }
      }
      
    }

    TimLaiDoiBaiTrungNhau() {
      //add lai cai bg
      // CGSize screenSize = [[CCDirector sharedDirector] winSize];
      const screenSize = view.getDesignResolutionSize()
      
      // TODO: thay thế bằng active = true / false, không tạo mới
      // CCSprite *cardBG = [CCSprite spriteWithFile:@"xapbaibosung.png"];
      // cardBG.position =  ccp(screenSize.width/2 + 2, 129);
      // cardBG.tag = 104;
      // cardBG.scale = 0.55;
      // [self addChild:cardBG];
      this.xapBaiNode.active = true;
      
      this.demFindLai = 0;
      for (let i = 0; i < this.arrSPCardsDuoiLai.length; i++) {
        const spCard = this.arrSPCardsDuoiLai[i];
        const tagCard = spCard.name;
        // spCard.scale = 0.55;
        spCard.setScale(new Vec3(0.55, 0.55, 0.55))

        // position = ccp(screenSize.width/2, 132);
        spCard.setPosition(this.xapBaiPos)
        
        // [self addChild:spCard z:1 tag:tagCard];
        this.canvasNode.addChild(spCard)
      }
      // [self schedule:@selector(findLaiCardTrungNhau:) interval:2.5];
      this.schedule(this.findLaiCardTrungNhau, 2.5)
    }

    findLaiCardTrungNhau() {
      if (this.demFindLai < this.arrSPCardsDuoiLai.length / 2) {
		
        const screenSize = view.getDesignResolutionSize();
        const sp1 = this.arrSPCardsDuoiLai[this.demFindLai];
        const sp2 = this.arrSPCardsDuoiLai[this.arrSPCardsDuoiLai.length - this.demFindLai - 1];
        
        const idsp1 = parseInt(sp1.name);
        const idsp2 = parseInt(sp2.name);
        if ((idsp1- 1)/4 == (idsp2-1)/4  && (idsp1 != idsp2)) {
          this.demsodoidachon++;
          switch (this.demsodoidachon) {
            case 1:
              this.idDoi1 = (idsp1 - 1)/4 + 1;
              break;
            case 2:
              this.idDoi2 = (idsp1 - 1)/4 + 1;
              break;
            case 3:
              this.idDoi3 = (idsp1 - 1)/4 + 1;
              break;
            default:
              break;
          }
          if (this.demsodoidachon < 4) {
            // CCMoveTo *move1 = [CCMoveTo actionWithDuration:1 position:CGPointMake(screenSize.width/2, screenSize.height/2)];
            // CCScaleTo *scale1 = [CCScaleTo actionWithDuration:1 scale:1];
            // CCSpawn *actionZoomOut1 = [CCSpawn actions:move1, scale1, nil];
            // CCDelayTime *delayTime1 = [CCDelayTime actionWithDuration:0.5f];
            // CCMoveTo *moveback1 = [CCMoveTo actionWithDuration:1 position:CGPointMake(20 + 62*demsodoidachon, 350)];
            // CCScaleTo *scaleback1 = [CCScaleTo actionWithDuration:1 scale:0.55];
            // CCSpawn *actionZoomIn1 = [CCSpawn actions:moveback1, scaleback1, nil];
            
            // CCSequence *sequence1 = [CCSequence actions:actionZoomOut1,delayTime1, actionZoomIn1, nil];
            // [sp1 runAction:sequence1];

            tween(sp1)
                .to(1, { 
                  position: new Vec3(0, 0, 0),
                  scale: new Vec3(1, 1, 1)
                })
                // Delay 0.5 giây
                .delay(0.5)
                // Di chuyển trở về vị trí ban đầu + scale nhỏ lại
                .to(1, { 
                    position: new Vec3((20 + 62 * this.demsodoidachon) * 2 - screenSize.width / 2, 350 * 2 - screenSize.height / 2, 0),
                    scale: new Vec3(0.55, 0.55, 1)
                })
                .start()
            
            
            // CCMoveTo *move2 = [CCMoveTo actionWithDuration:1 position:CGPointMake(screenSize.width/2 + 20, screenSize.height/2)];
            // CCScaleTo *scale2 = [CCScaleTo actionWithDuration:1 scale:1];
            // CCSpawn *actionZoomOut2 = [CCSpawn actions:move2, scale2, nil];
            // CCDelayTime *delayTime2 = [CCDelayTime actionWithDuration:0.5f];
            // CCMoveTo *moveback2 = [CCMoveTo actionWithDuration:1 position:CGPointMake(30 + 62*demsodoidachon, 350)];
            // CCScaleTo *scaleback2 = [CCScaleTo actionWithDuration:1 scale:0.55];
            // CCSpawn *actionZoomIn2 = [CCSpawn actions:moveback2, scaleback2, nil];
            
            // CCSequence *sequence2 = [CCSequence actions:actionZoomOut2,delayTime2, actionZoomIn2, nil];
            // [sp2 runAction:sequence2];

            // Tween cho sp2
            tween(sp2)
            // Zoom out + di chuyển ra giữa màn hình (lệch 20px)
            .to(1, { 
                position: new Vec3(20 * 2, 0, 1),
                scale: new Vec3(1, 1, 1)
            })
            // Dừng 0.5s
            .delay(0.5)
            // Zoom in + di chuyển về chỗ cũ
            .to(1, { 
                position: new Vec3((30 + 62 * this.demsodoidachon) * 2 - screenSize.width / 2, 350 * 2 - screenSize.height / 2),
                scale: new Vec3(0.55, 0.55, 1)
            })
            .start();

          }
          else {
            // CCMoveTo *move1 = [CCMoveTo actionWithDuration:1 position:CGPointMake(screenSize.width/2, screenSize.height/2)];
            // CCScaleTo *scale1 = [CCScaleTo actionWithDuration:1 scale:1];
            // CCSpawn *actionZoomOut1 = [CCSpawn actions:move1, scale1, nil];
            // CCDelayTime *delayTime1 = [CCDelayTime actionWithDuration:0.5f];
            // CCMoveTo *moveback1 = [CCMoveTo actionWithDuration:1 position:CGPointMake(20 + 62*(demsodoidachon - 3), 270)];
            // CCScaleTo *scaleback1 = [CCScaleTo actionWithDuration:1 scale:0.55];
            // CCSpawn *actionZoomIn1 = [CCSpawn actions:moveback1, scaleback1, nil];
            
            // CCSequence *sequence1 = [CCSequence actions:actionZoomOut1,delayTime1, actionZoomIn1, nil];
            // [sp1 runAction:sequence1];
            tween(sp1)
                .to(1, { 
                  position: new Vec3(0, 0, 0),
                  scale: new Vec3(1, 1, 1)
                })
                // Delay 0.5 giây
                .delay(0.5)
                // Di chuyển trở về vị trí ban đầu + scale nhỏ lại
                .to(1, { 
                    position: new Vec3((20 + 62 * (this.demsodoidachon - 3)) * 2 - screenSize.width / 2, 270 * 2 - screenSize.height / 2, 0),
                    scale: new Vec3(0.55, 0.55, 1)
                })
                .start()
            
            // CCMoveTo *move2 = [CCMoveTo actionWithDuration:1 position:CGPointMake(screenSize.width/2 + 20, screenSize.height/2)];
            // CCScaleTo *scale2 = [CCScaleTo actionWithDuration:1 scale:1];
            // CCSpawn *actionZoomOut2 = [CCSpawn actions:move2, scale2, nil];
            // CCDelayTime *delayTime2 = [CCDelayTime actionWithDuration:0.5f];
            // CCMoveTo *moveback2 = [CCMoveTo actionWithDuration:1 position:CGPointMake(30 + 62*(demsodoidachon -3), 270)];
            // CCScaleTo *scaleback2 = [CCScaleTo actionWithDuration:1 scale:0.55];
            // CCSpawn *actionZoomIn2 = [CCSpawn actions:moveback2, scaleback2, nil];
            
            // CCSequence *sequence2 = [CCSequence actions:actionZoomOut2,delayTime2, actionZoomIn2, nil];
            // [sp2 runAction:sequence2];

            // Tween cho sp2
            tween(sp2)
              // Zoom out + di chuyển ra giữa màn hình (lệch 20px)
              .to(1, { 
                  position: new Vec3(20 * 2, 0, 1),
                  scale: new Vec3(1, 1, 1)
              })
              // Dừng 0.5s
              .delay(0.5)
              // Zoom in + di chuyển về chỗ cũ
              .to(1, { 
                  position: new Vec3((30 + 62 * (this.demsodoidachon - 3)) * 2 - screenSize.width / 2, 270 * 2 - screenSize.height / 2),
                  scale: new Vec3(0.55, 0.55, 1)
              })
              .start();

          }
    
        }
        else {
          // CCMoveTo *move1 = [CCMoveTo actionWithDuration:1 position:CGPointMake(screenSize.width/2, screenSize.height/2)];
          // CCScaleTo *scale1 = [CCScaleTo actionWithDuration:1 scale:1];
          // CCSpawn *actionZoomOut1 = [CCSpawn actions:move1, scale1, nil];
          // CCDelayTime *delayTime1 = [CCDelayTime actionWithDuration:0.5f];
          // CCCallFuncND* call1 = [CCCallFuncND actionWithTarget:self 
          //                       selector:@selector(removeChildCard1:data:) 
          //                         data:(void *)sp1];
          // CCSequence *sequence1 = [CCSequence actions:actionZoomOut1,delayTime1, call1, nil];
          // [sp1 runAction:sequence1];

          tween(sp1)
                .to(1, { 
                  position: new Vec3(0, 0, 0),
                  scale: new Vec3(1, 1, 1)
                })
                // Delay 0.5 giây
                .delay(0.5)
                // Di chuyển trở về vị trí ban đầu + scale nhỏ lại
                .call(function() {
                  this.removeChildCard1(sp1);
                })
                .start()
          
          // CCMoveTo *move2 = [CCMoveTo actionWithDuration:1 position:CGPointMake(screenSize.width/2 + 20, screenSize.height/2)];
          // CCScaleTo *scale2 = [CCScaleTo actionWithDuration:1 scale:1];
          // CCSpawn *actionZoomOut2 = [CCSpawn actions:move2, scale2, nil];
          // CCDelayTime *delayTime2 = [CCDelayTime actionWithDuration:0.5f];
          // CCCallFuncND* call2 = [CCCallFuncND actionWithTarget:self 
          //                       selector:@selector(removeChildCard2:data:) 
          //                         data:(void *)sp2];
          // CCSequence *sequence2 = [CCSequence actions:actionZoomOut2,delayTime2, call2, nil];
          // [sp2 runAction:sequence2];

          tween(sp2)
            .to(1, { 
              position: new Vec3(20 * 2, 0, 0),
              scale: new Vec3(1, 1, 1)
            })
            // Delay 0.5 giây
            .delay(0.5)
            // Di chuyển trở về vị trí ban đầu + scale nhỏ lại
            .call(function() {
              this.removeChildCard2(sp2);
            })
            .start()
          
        }
        this.demFindLai++;
        if (this.demFindLai >= this.arrSPCardsDuoiLai.length / 2) {
          // [self removeChildByTag:104 cleanup:YES];
          this.xapBaiNode.active = false;
        }
      }
      else {
        this.unschedule(this.findLaiCardTrungNhau)
        if (this.demsodoidachon == 0) {
          // CCLabelTTF *lblThongbao = [CCLabelTTF labelWithString:@"Bạn chưa thật sự thành tâm nên thần bài chưa bật mí, xin vui lòng thử lại!" 
          //                     dimensions:CGSizeMake(300, 200) 
          //                   alignment:CCTextAlignmentCenter  
          //                     fontName:@"Marker Felt" 
          //                     fontSize:22];
          // lblThongbao.color = ccORANGE;
          // lblThongbao.position = CGPointMake(160, 150);
          // [self addChild:lblThongbao z:5];
        }
        else {
          // CCLabelTTF *lblThongbao = [CCLabelTTF labelWithString:@"Xin mời bạn xem quẻ bói." 
          //                           dimensions:CGSizeMake(300, 200) 
          //                         alignment:CCTextAlignmentCenter  
          //                           fontName:@"Marker Felt" 
          //                           fontSize:22];
          // lblThongbao.color = ccORANGE;
          // lblThongbao.position = CGPointMake(160, 150);
          // [self addChild:lblThongbao z:5];
          // flagNext = TRUE;
        }
        
      }
    }

    // - (void) removeChildCard1:(id) sender data : (void*) data {
    //   CCSprite *spCard1 = (CCSprite *) data;
    //   [self removeChild:spCard1 cleanup:NO];
    // }
    // - (void) removeChildCard2:(id) sender data : (void*) data {
    //   CCSprite *spCard2 = (CCSprite *) data;
    //   [self removeChild:spCard2 cleanup:NO];
    // }

    removeChildCard1(cardNode: Node) {
      console.log(`removeChildCard1: ${cardNode.name}`)
      this.canvasNode.removeChild(cardNode)
    }

    removeChildCard2(cardNode: Node) {
      console.log(`removeChildCard2: ${cardNode.name}`)
      this.canvasNode.removeChild(cardNode)
    }

}

