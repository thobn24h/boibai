import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('IntroduceCHTTScene')
export class IntroduceCHTTScene extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    clickBack() {
        director.loadScene('menuScene');
    }

    clickNext() {
        director.loadScene('menuScene');
    }
}

