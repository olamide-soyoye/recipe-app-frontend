import React from "react";
import RecipeList from "../components/RecipeList";
import Header from "../components/Layouts/Header";
import CarouselReuse from "../components/Carousel/carousel";

const carouselItems = [
  {
    src: "/assets/img/receipe_prepare.jpg",
    title: "Enjoy Your Special Meal",
    description: "We make it easy for you to give your guest a special meal...",
    interval: 2000,
  },
  {
    src: "/assets/img/blue_razz.jpg",
    title: "Good Food Good Life",
    description: "Just relax and we'll give you good food",
    interval: 3000,
  },
  {
    src: "/assets/img/yougurt_drink.jpg",
    title: "Food is only one aspect of an exprience",
    description: "Enjoy the best exprience from your food,",
    interval: 4000,
  },
];

const HomePage = () => {
  return (
    <>
      <Header />
      <CarouselReuse items={carouselItems} />
      <RecipeList />
    </>
  );
};

export default HomePage;
