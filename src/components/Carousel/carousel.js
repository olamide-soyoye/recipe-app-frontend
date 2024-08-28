import React from "react";
import "./carousel.css";
import Carousel from "react-bootstrap/Carousel";

const CarouselReuse = ({ items }) => {
  return (
    <Carousel>
      {items.map((item, index) => (
        <Carousel.Item interval={item.interval} key={index}>
          <img
            className="d-block w-100"
            src={item.src}
            alt={item.alt || `Slide ${index + 1}`}
          />
          <Carousel.Caption>
            <h3 className="carousel-text">{item.title || `Slide Title`}</h3>
            <p className="carousel-text">{item.description || `Slide Description`}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};
export default CarouselReuse;
