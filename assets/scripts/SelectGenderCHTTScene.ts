import { _decorator, Component, EventTouch, Node, Toggle, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SelectGenderCHTTScene')
export class SelectGenderCHTTScene extends Component {

    @property(Toggle)
    maleToggle: Toggle = null;

    @property(Toggle)
    femaleToggle: Toggle = null;

    start() {

    }

    update(deltaTime: number) {
        
    }

    maleCheckEvent(event: EventTouch) {
        console.log('maleCheckEvent');
        this.femaleToggle.isChecked = false;
    }

    femaleCheckEvent(event: EventTouch) {
        console.log('femaleCheckEvent');
        this.maleToggle.isChecked = false;
    }

    clickBack() {
        director.loadScene('IntroduceCHTTScene');
    }

    clickNext() {
        director.loadScene('ActionCards');
    }
}

