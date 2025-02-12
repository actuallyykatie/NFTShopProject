import React, {useEffect, useRef, useState} from 'react';
import {Button, Col, Container, Form, InputGroup, Row} from "react-bootstrap";
import {ShopItem} from "./ShopItem";
import "./SingleItemComponent.scss";
import {DataServiceInstance} from "./DataService";
import {useParams} from "react-router-dom";
import {cartService} from "./CartService";
import {cartItemFromShopItem} from "./CartItem";
import {CheckboxDescription, Description, ImageDescription, TextDescription} from "./Descriptions";
import {CommentItem} from "./CommentItem";

// Состояние компоненты "Страница товара"
interface SingleItemComponentState {
    item: ShopItem | null;
    comments: CommentItem[];
}

/**
 * Страница товара
 */
export function SingleItemComponent() {
    // itemId из URL-адреса. Пример /item/1, itemId == 1
    let {itemId} = useParams();

    let textAreaRef = useRef<HTMLTextAreaElement>(null);

    let [state, changeState] = useState<SingleItemComponentState>({
        item: null,
        comments: []
    });

    useEffect(() => {
        // Один раз загружаем информацию о товаре
        if (itemId) {
            let itemPromise = DataServiceInstance.getItem(+itemId);

            let commentsPromise = DataServiceInstance.getAllComments(+itemId);

            Promise.all([itemPromise, commentsPromise]).then(([item, comments]) => {
                changeState({
                    item: item,
                    comments: comments
                })
            });
        }
    }, []);

    let item = state.item;

    /**
     * Функция обработки добавления в корзину
     */
    function addToCart() {
        if (item != null) {
            cartService.addCartItem(cartItemFromShopItem(item));
        }
    }

    function renderText(desc: TextDescription) {
        return (
          <p>{desc.text}</p>
        );
    }

    function renderImage(desc: ImageDescription) {
        return (
          <img className="description-image" src={desc.imageSrc}/>
        );
    }

    function renderCheckbox(desc: CheckboxDescription) {
        return (
            <div>
                <Form>
                    {
                        desc.variant.map(checkBox => {
                            return (
                                <Form.Check name={desc.name} type={"checkbox"} label={checkBox}/>
                            )
                        })
                    }
                </Form>
            </div>
        );
    }

    function renderDescriptions(descriptions: Description[]) {
        if (!descriptions) {
            return (<div></div>);
        }

        return descriptions.map((description: Description) => {
            if (description.type === "text") {
                return renderText(description as TextDescription);
            } else if (description.type === "image") {
                return renderImage(description as ImageDescription);
            } else if (description.type === "checkbox") {
                return renderCheckbox(description as CheckboxDescription);
            }
        });
    }

    async function submitComment() {
        let current: HTMLTextAreaElement | null = textAreaRef.current;

        if (!current) {
            return;
        }

        let textContent = current.value;

        if (!textContent) {
            return;
        }

        let itemId = state.item?.id;

        if (!itemId) {
            return;
        }

        await DataServiceInstance.submitComment(itemId, textContent);

        current.value = "";

        state.comments.push({
            text: textContent,
            shopItemId: 0
        });

        changeState({
            ...state,
            comments: state.comments
        });
    }

    /**
     * Отрисовка элемента
     * @param item
     */
    function renderItem(item: ShopItem | null) {
        if (!item) {
            return (<div></div>);
        }

        return (
            <Container>
                <Row>
                    <Col >
                        <img className={"rounded"} style={{height:'100%',width:'500px'}}
                             src={item.imageSrc} />
                    </Col>
                    <Col style={{ marginLeft: 5 }} >
                        <h1>{item.title}</h1>
                        <p>Brief: {item.brief}</p>
                        <h5>Description</h5>
                        {renderDescriptions(item.description)}
                        <p><b>{item.price} ETH</b></p>
                        <Button onClick={() => addToCart()} variant={"dark"}>
                            Add to cart
                        </Button>
                    </Col>
                </Row>

                <div className="comment-block " style={{ marginTop: 30 }}>
                    <h4  style={{ marginBottom: 20 }}>Comments</h4>
                    {
                        state.comments.map(comment => {
                            return (
                                <Row>
                                    <Col>
                                        <div className="alert alert-light shadow-sm ">
                                            {comment.text}
                                        </div>
                                    </Col>
                                </Row>
                            )
                        })
                    }
                </div>

                <Row>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label style={{marginTop:10}}>
                                <h6>Your thoughts?</h6>
                            </Form.Label>
                            <Form.Control as="textarea" rows={3} />
                        </Form.Group>
                    </Form>
                </Row>
                <Row>
                    <Col>
                        <Button onClick={() => submitComment()} variant={"dark"}>Submit</Button>
                    </Col>
                </Row>
            </Container>
        );
    }

    return renderItem(item);
}
