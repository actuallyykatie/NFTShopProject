import {useEffect, useState} from "react";
import {ShopItem} from "./ShopItem";
import {DataServiceInstance} from "./DataService";
import {CartItem} from "./CartItem";
import "./CartItemComponent.scss";
import {Card, Col, Row} from "react-bootstrap";


// Входные данные компоненты элемента корзины
interface CartItemComponentProps {
    // Элемент корзины
    cartItem: CartItem;
}

// Состояние компоненты
interface CartItemComponentState {
    // Товар
    item: ShopItem | null;
}

// Компонента элемента корзины
export function CartItemComponent(props: CartItemComponentProps) {

    let [state, changeState] = useState<CartItemComponentState>({
        item: null
    });

    useEffect(() => {
        DataServiceInstance.getItem(props.cartItem.id).then(value => {
            changeState({
                item: value
            });
        });
    }, []);

    return (
        <Card className="shadow-sm cart-item">
            <Row>
                <Col xs={4} style={{ width: 'auto', marginTop:'3px 0', marginBottom:'3px 0'}}>
                    <img className="img-fluid rounded-start" src={state.item?.imageSrc}/>
                </Col>
                <Col xs={4}>
                    <Card.Body style={{ width: '15rem', marginTop:'3px 0', marginBottom:'3px 0'}}>
                        <Card.Title>{state.item?.title}</Card.Title>
                        <Card.Text>
                            <div>
                                Quantity: {props.cartItem.quantity}
                            </div>
                            <div>
                                {
                                // То же самое что
                                // let itemPrice = 0;
                                // if (state.item != null) {
                                //     itemPrice = props.cartItem.quantity * state.item.price;
                                // }
                                //
                                // Price: ${itemPrice}
                                }

                                Price: {props.cartItem.quantity * (state.item?.price ?? 0)} ETH
                            </div>
                        </Card.Text>
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    );
}
