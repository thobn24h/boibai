import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MenuScene')
export class MenuScene extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    clickBtnBoiNgay() {
      director.loadScene("BoiNgayScene")
    }

    clickBtnBoiCHTT() {
      director.loadScene("menuScene")
    }
}

