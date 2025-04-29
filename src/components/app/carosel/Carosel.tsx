import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Button } from "@/components/ui/button";

interface CarouselProps {
  items: {
    id: string | number;
    image: string;
    title?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
  }[];
}

const Carousel = ({ items }: CarouselProps) => {
  return (
    <div className="w-full rounded-lg overflow-hidden" key={items[0].id}>
      <Swiper
        effect={"fade"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={1}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        modules={[Navigation, Autoplay, EffectFade]}
        className="swiper_container"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="relative h-[400px] md:h-[450px] w-full">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10"></div>
              
              {/* Background image */}
              <img
                className="absolute w-full h-full object-cover"
                src={item.image}
                alt={item.title || "Promotional slide"}
              />
              
              {/* Content */}
              <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-12 lg:px-20 max-w-3xl text-white">
                <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-5">
                  {item.title || "Featured Content"}
                </h2>
                
                <p className="text-sm md:text-base opacity-90 mb-6 md:mb-8 line-clamp-3">
                  {item.description || "Check out our featured content and discover something new today. Don't miss this amazing opportunity."}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Button 
                    className="bg-[var(--chart-4)] hover:bg-[var(--chart-4)]/90 text-white"
                    size="lg"
                  >
                    {item.ctaText || "Watch Now"}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/20"
                    size="lg"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        <div className="slider-controler">
          <div className="swiper-button-prev slider-arrow !text-white"></div>
          <div className="swiper-button-next slider-arrow !text-white"></div>
        </div>
      </Swiper>
    </div>
  );
};

export default Carousel;
