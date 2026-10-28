import {useEffect, useRef} from 'react';
import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';

function RangePrice({
  MIN,
  MAX,
  onUpdate,
  sliderInstance,
}: {
  MIN: number;
  MAX: number;
  onUpdate: (min: number, max: number) => void;
  sliderInstance: any;
}) {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sliderRef.current) return;

    sliderInstance.current = noUiSlider.create(sliderRef.current, {
      start: [MIN, MAX],
      connect: true,
      range: {min: MIN, max: MAX},
    });

    sliderInstance.current.on('update', (values: string[]) => {
      onUpdate(Math.round(Number(values[0])), Math.round(Number(values[1])));
    });

    return () => sliderInstance.current?.destroy();
    // eslint-disable-next-line
  }, [MIN, MAX]);

  return <div ref={sliderRef} />;
}

export default RangePrice;
