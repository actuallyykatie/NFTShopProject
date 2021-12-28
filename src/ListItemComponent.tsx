import React from 'react';
import {ShopItem} from "./ShopItem";
import {Button, Card} from "react-bootstrap";
import "./ListItemComponent.scss";
import {Link} from "react-router-dom";
import {cartService} from "./CartService";
import {cartItemFromShopItem} from "./CartItem";

/**
 * Входные параметры компоненты "элемент списка на главной странице"
 */
interface ListItemComponentProps {
    // Товар
    item: ShopItem;
}

/**
 * Элемент списка товаров на главной странице
 * @param props Входные параметры.
 */
export function ListItemComponent(props: ListItemComponentProps) {
    let item = props.item;

    // Функция для обработки нажатия на кнопку "добавить в корзину"
    function addToCart(item: ShopItem) {
        cartService.addCartItem(cartItemFromShopItem(item));
    }

    return (
        <Card className={"shadow-sm list-item"} style={{ width: '15rem', height: '23rem', marginTop:'3px 0', marginBottom:'3px 0'}}>

            <Card.Img style={{height: 200, width:"auto"}} variant="top" src={item.imageSrc} />

            <Card.Body style={{ height: 40, marginTop:'3px 0', marginBottom:'0px'}}>
                <Card.Title>
                    <a href={"/item/" + item.id} className="link-dark">
                       {item.title.substring(0, 30) }{item.title.length >= 23 && `...` }
                    </a>
                </Card.Title>

                <h6 className="card-subtitle mb-2 text-muted">
                    {item.brief.substring(0, 20) }{item.brief.length >= 20 && `...` }
                </h6>
            </Card.Body>
            <Card.Body style = {{height: 40}}>
                <Card.Footer style = {{background: '#ffffff'}}>
                                <div className="d-flex example-parent">
                                    <div className="p-2 col-example"><b>{item.price} ETH </b></div>
                                    <div className="p-2 col-example"></div>
                                    <div className="ml-auto p-2 col-example">
                                        <Button onClick={() => addToCart(item)} variant="dark" size={"sm"} style={{float: 'right'}}>
                                            Add
                                        </Button>
                                    </div>
                                </div>
                </Card.Footer>
            </Card.Body>
        </Card>
    );
}
