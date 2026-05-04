import sliderImage1 from '../../assets/imgs/slider-image-1.jpeg'
import sliderImage2 from '../../assets/imgs/slider-image-2.jpeg'
import sliderImage3 from '../../assets/imgs/slider-image-3.jpeg'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper modules
import { Autoplay } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';


export default function HomeSlider() {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Slider */}
        <div className="lg:col-span-8 rounded-xl overflow-hidden shadow-lg">
          <Swiper
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
            className="h-[400px] md:h-[500px]"
          >
            <SwiperSlide>
              <div className="relative h-full">
                <img
                  className="w-full h-full object-cover"
                  src={sliderImage3}
                  alt="Featured Product"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">New Collection</h2>
                    <p className="text-sm md:text-base">Discover our latest arrivals</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative h-full">
                <img
                  className="w-full h-full object-cover"
                  src={sliderImage3}
                  alt="Featured Product"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Special Offers</h2>
                    <p className="text-sm md:text-base">Limited time deals</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        {/* Side Images */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl overflow-hidden shadow-lg relative group">
            <img
              className="w-full h-[240px] object-cover transition-transform duration-300 group-hover:scale-105"
              src={sliderImage1}
              alt="Featured Category"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="text-xl font-semibold mb-1">Summer Collection</h3>
                <p className="text-sm">Shop Now</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg relative group">
            <img
              className="w-full h-[240px] object-cover transition-transform duration-300 group-hover:scale-105"
              src={sliderImage2}
              alt="Featured Category"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="text-xl font-semibold mb-1">New Arrivals</h3>
                <p className="text-sm">Explore More</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
