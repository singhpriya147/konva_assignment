import { useEffect, useRef } from 'react';
import Konva from 'konva';

const CombinedComponent = () => {
  const stageRef = useRef(null);
  const imageRef = useRef(null);
  const transformerRef = useRef(null);
  const transformerRef2 = useRef(null);
  const textNodeRef = useRef(null);

  useEffect(() => {
    const stage = new Konva.Stage({
      container: 'stage-container',
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const layer = new Konva.Layer();
    stage.add(layer);
    const img1 = new Image();
    img1.src =
      'https://pixabay.com/images/download/people-2944065_640.jpg?attachment';
    const konvaImage = new Konva.Image({
      image: img1,
      x: 0,
      y: 0,
      width: 500, // Adjust size as needed
      height: 500, // Adjust size as needed
      draggable: true,
    });

    layer.add(konvaImage);
    // stageRef.current = stage;
    imageRef.current = konvaImage;

    const tr = new Konva.Transformer({
      node: konvaImage,
      enabledAnchors: [
        'middle-left',
        'middle-right',
        'top-right',
        'top-left',
        'bottom-left',
        'bottom-right',
      ],
      boundBoxFunc: (oldBox, newBox) => {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      },
    });

    layer.add(tr);
    transformerRef.current = tr;

    const layer2 = new Konva.Layer();
    const textNode = new Konva.Text({
      text: 'Some text here',
      x: 50,
      y: 80,
      fontSize: 50,
      draggable: true,
      width: 200,
      fill: 'red',
    });

    const tr2 = new Konva.Transformer({
      node: textNode,
      enabledAnchors: [
        'middle-left',
        'middle-right',
        'top-right',
        'top-left',
        'bottom-left',
        'bottom-right',
      ],
      boundBoxFunc: (oldBox, newBox) => {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      },
    });
    layer2.add(textNode);
    layer2.add(tr2);

    textNode.on('transform', () => {
      textNode.width(textNode.width() * textNode.scaleX());
      textNode.scaleX(1);
    });
    textNode.on('dblclick', () => {
      console.log('Doubleclicke');
      handleDoubleClick(textNode, tr2, stage);
    });
    textNodeRef.current = textNode;
    transformerRef2.current = tr2;
    stageRef.current = stage;
    stage.add(layer2);
    stage.draw();
  }, []);

  const handleDoubleClick = (textNode, tr, stage) => {
    textNode.hide();
    // tr.hide();

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
    // textarea.style.height =
    //   textNode.height() - textNode.padding() * 2 + 5 + 'px';
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
  };

  return (
    <div className='relative w-full h-screen overflow-hidden bg-slate-400'>
      <div className='absolute top-0 z-10 full py-2'>
        <div id='stage-container'></div>
      </div>
    </div>
  );
};

export default CombinedComponent;
