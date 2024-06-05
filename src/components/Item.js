import React, { Component } from 'react';

export class Item extends Component {
    render() {
        const photoUrl = this.props.item.photo ?
                        (this.props.item.photo.startsWith('http') ?
                        this.props.item.photo : "./img/" + this.props.item.photo) :
                        null;

        return (
            <div className='item'>
                <img src={photoUrl} alt="Product" />
                <h2>{this.props.item.name}</h2>
                <p>{this.props.item.description}</p>
                <b>{this.props.item.price}$</b>
                <div className='add_to_cart'>+</div>
            </div>
        );
    }
}

export default Item;
