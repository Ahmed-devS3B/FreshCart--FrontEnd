import axios from "axios"
import { use, useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import 'swiper/css'
import Loading from "../Loading/Loading"
import { useQuery } from "@tanstack/react-query"

export default function CategorySlider() {
   
  //get categories function ' don't change it'
    async function getCategories() {
        const options = {
            url: 'https://ecommerce.routemisr.com/api/v1/categories',
            method: 'GET',
        }
       return axios.request(options)
    }
   let {data, isError, isLoading, isFetched, isFetching} = useQuery ({
      queryKey:['categories'],
      queryFn:getCategories,
      refetchOnMount:false,
      staleTime:60*60*1000,
    })

    if(isLoading) return <Loading/>

   


    return <>
      <section className="my-8">
        <h2 className="mb-5 text-lg text-gray-600 font-semibold">Show Popular Categories</h2>
      <Swiper slidesPerView={6} loop = {true}>
            {data.data.data.map((category) => <SwiperSlide key={category._id}>
               <div className="h-64">
               <img src={category.image} alt="" className="w-full h-full object-cover" />
               </div>
                <h3 className="mt-3">{category.name}</h3>
            </SwiperSlide>)}

        </Swiper>
      </section>

    </>
}
