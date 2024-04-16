import  { useEffect, useRef } from 'react';
import Konva from 'konva';

const CanvasComponent = () => {
  const stageRef = useRef(null);
  const textNodeRef = useRef(null);
  const trRef = useRef(null);
  // const textareaRef = useRef(null);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const stage = new Konva.Stage({
      container: 'konva-container',
      width: width,
      height: height,
      // color:'red',
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    const textNode = new Konva.Text({
      text: 'Some text here',
      x: 50,
      y: 80,
      fontSize: 20,
      draggable: true,
      width: 200,
    });

    layer.add(textNode);

    const tr = new Konva.Transformer({
      node: textNode,
      enabledAnchors: ['middle-left', 'middle-right'],
      boundBoxFunc: (oldBox, newBox) => {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      },
    });

    textNode.on('transform', () => {
      textNode.setAttrs({
        width: textNode.width() * textNode.scaleX(),
        scaleX: 1,
      });
    });

    layer.add(tr);

    textNodeRef.current = textNode;
    trRef.current = tr;

    stageRef.current = stage;

    return () => {
      // Clean up Konva objects on component unmount
      stage.destroy();
    };
  }, []);

  const handleDoubleClick = () => {
    const textNode = textNodeRef.current;
    const tr = trRef.current;
    const stage = stageRef.current;
    if(stage){
      console.log(" stage is present ");
    }

    textNode.hide();
    tr.hide();
    stage.batchDraw();

    const textPosition = textNode.absolutePosition();
    const areaPosition = {
      x: textPosition.x,
      y: textPosition.y,
    };

    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.value = textNode.text();
    textarea.style.position = 'absolute';
    textarea.style.top = areaPosition.y + 'px';
    textarea.style.left = areaPosition.x + 'px';
    textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
    textarea.style.height =
      textNode.height() - textNode.padding() * 2 + 5 + 'px';
    textarea.style.fontSize = textNode.fontSize() + 'px';
    textarea.style.border = 'none';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'none';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = textNode.lineHeight();
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = 'left top';
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill();
    const rotation = textNode.rotation();
    let transform = '';
    if (rotation) {
      transform += 'rotateZ(' + rotation + 'deg)';
    }
    textarea.style.transform = transform;

    textarea.addEventListener('keydown', (e) => {
      if (e.keyCode === 13 && !e.shiftKey) {
        textNode.text(textarea.value);
        document.body.removeChild(textarea);
        textNode.show();
        tr.show();
        stage.batchDraw();
      }
      if (e.keyCode === 27) {
        document.body.removeChild(textarea);
        textNode.show();
        tr.show();
        stage.batchDraw();
      }
    });
  };

  return <div id='konva-container' onDoubleClick={handleDoubleClick}></div>;
};

export default CanvasComponent;
