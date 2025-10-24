import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LabelContent')
export class LabelContent extends Component {
  @property(Label)
  label: Label = null;

  setContent(content: string) {
      this.label.string = content;
  }
}

