import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

interface CarouselProps {
  items: {
    id: string | number;
    image: string;
    title?: string;
  }[];
}

const Carousel = ({ items }: CarouselProps) => {
  return (
    <div className="w-full">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={1}
        pagination={{ el: ".swiper-pagination", clickable: true }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }}
        modules={[Pagination, Navigation]}
        className="swiper_container"
      >
        {items.map((item: any) => {
          return (
            <SwiperSlide>
              <div className="flex bg-amber-200">
                <img
                  height={400}
                  width="100%"
                  className="!h-[400px] object-cover"
                  src={item.image}
                  alt="slide_image"
                />
                <div className="w-[50%]">test</div>
              </div>
            </SwiperSlide>
          );
        })}

        <div className="slider-controler">
          <div className="swiper-button-prev slider-arrow"></div>
          <div className="swiper-button-next slider-arrow"></div>
          <div className="swiper-pagination"></div>
        </div>
      </Swiper>
    </div>
  );
};

export default Carousel;
