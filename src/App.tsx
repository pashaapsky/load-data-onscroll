import React, {FC, useState, useRef, useEffect, useCallback} from 'react';
import throttle from 'lodash/throttle';

interface IProduct {
    title: string,
    price: string
}

let products: Array<IProduct> = Array(30)
    .fill(0)
    .map((item, index) => ({
        title: `Товар №${index + 1}`,
        price: (Math.random() * 8 + 1).toFixed(2)
    }));


const App: FC = () => {
    const [maxCount, setMaxCount] = useState<number>(4);

    const wrapperRef = useRef<HTMLUListElement>(null);


    // Объявляем функцию для отслеживания скролла.
    // Обязательно сохраняем одну и ту же ссылку у onScroll, чтобы позже удалить слушатель.
    // Для этого используем useCallback
    const onScrollCallback = useCallback(throttle((e: any) => {
        console.log('scroll');
        if (e.target) {
            const isEnd = e.target.clientWidth + e.target.scrollLeft >= e.target.scrollWidth ;

            if (isEnd) {
                // Если дошли до конца, показываем 1 новый товар
                setMaxCount(count => count + 1);
            }
        }
    }, 200), []);

    // Следим за изменениями переменных maxCount, onScroll.
    // Если макс. отображаемых товаров >= кол-во товаров
    // Удаляем слушатель скролла у основного блока wrapper
    React.useEffect(() => {
        if (wrapperRef.current && maxCount >= products.length) {
            wrapperRef.current.removeEventListener('scroll', onScrollCallback);
        }
    }, [maxCount, onScrollCallback]);

    // Устанавливаем слушатель скролла на блок wrapper
    // И очищаем, если произошло размонтирование компонента
    useEffect(() => {
        wrapperRef.current?.addEventListener("scroll", onScrollCallback);
        return () => {
            wrapperRef.current?.removeEventListener("scroll", onScrollCallback);
        }
    }, [onScrollCallback]);

    return (
        <div  className="wrapper">
            <ul ref={wrapperRef} className="columns" >
                {products.slice(0, maxCount).map((item: IProduct, index: number) => (
                    <li className="product-item" key={index}>
                        <p><strong>Название: </strong>{item.title}</p>
                        <p><strong>Цена: </strong>{item.price}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;

