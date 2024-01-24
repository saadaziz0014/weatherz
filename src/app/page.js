'use client'
import { apiHost, apiKey, apiUrl, weatherUrl } from "@/constants/api";
import axios from "axios";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { TbTemperatureCelsius } from "react-icons/tb";
import { FaWind } from "react-icons/fa";
import { MdOutlineVisibility } from "react-icons/md";
import { WiHumidity } from "react-icons/wi";
import { FaCloudRain } from "react-icons/fa";
import { TiWeatherCloudy } from "react-icons/ti";
import { ToastContainer, toast } from 'react-toastify';
import { Bounce, Flip } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';


export default function Home() {
  const [city, setCity] = useState("");
  const [displayCity, setDisplayCity] = useState({ name: "Enter City", lon: "0.00", lat: "0.00" });
  const [tempData, setTempData] = useState('');
  const [contact, setContact] = useState({ email: "", message: "" });
  const handleCityChange = (e) => {
    setDisplayCity({ name: "Enter City", lat: '0.00', lon: '0.00' });
    setCity(e.target.value)
  }
  const findLocationAndTemprature = async () => {
    setDisplayCity({ name: 'Enter City', lat: '0.00', lon: '0.00' });
    setTempData("");
    const options = {
      method: 'GET',
      url: apiUrl,
      params: {
        text: city,
        language: 'en'
      },
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost
      }
    };
    await axios.request(options).then(async (data) => {
      setDisplayCity({ name: data.data[0].name, lon: data.data[0].lon, lat: data.data[0].lat });
      const optionsWeather = {
        method: 'GET',
        url: weatherUrl,
        params: {
          lat: data.data[0].lat,
          lon: data.data[0].lon,
          timezone: 'auto',
          language: 'en',
          units: 'auto'
        },
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': apiHost
        }
      }
      const resp = await axios.request(optionsWeather);
      setTempData(resp.data.current);
    });
  }
  const handleContactChange = (e) => {
    let { name, value } = e.target;
    setContact((contact) => ({
      ...contact,
      [name]: value
    }))
  }
  const handlleContactSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email) || contact.message.length <= 0) {
      toast.error('Check Email or Message!', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Flip,
      });
      setContact({
        email: '',
        message: ''
      })
      return;
    }
    const resp = await axios.post("/api/contact", {
      email: contact.email,
      message: contact.message
    });
    if (resp.status == 201) {
      toast.success('Thank You!', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
    setContact({ email: '', message: '' })
  }
  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      findLocationAndTemprature();
    }
  }
  return (
    <>
      <div className="flex justify-center p-2 mt-5">
        <div className="border-2 rounded-md p-2">
          <input type="text" placeholder="Enter Your City" value={city} className="focus:border-none focus:outline-none p-1 border-none" onKeyDown={handleKeyDown} onChange={handleCityChange} />
          <CiSearch className="inline mr-1 cursor-pointer" onClick={findLocationAndTemprature} />
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <div className="p-3 rounded-lg flex flex-col w-2/5  border-2 hover:bg-sky-400">
          {tempData != '' ? (
            <>
              <div className="flex justify-between">
                <h1>{tempData.temperature} <TbTemperatureCelsius className="inline" /></h1>
                <h3>{tempData.summary}</h3>
              </div>
              <div className="flex justify-between">
                <h1>{displayCity.name}</h1>
                <h3><FaWind className="inline" /> {tempData.wind.speed} m/s</h3>
              </div>
              <div className="flex justify-between">
                <h1>{tempData.temperature < 25 ? <MdOutlineVisibility className="inline" /> : <WiHumidity className="inline" />} {tempData.temperature < 25 ? tempData.visibility : tempData.humidity}</h1>
                <h3><FaCloudRain className="inline" /> {tempData.precipitation.total}%</h3>
              </div>
            </>
          ) : null}
        </div>
      </div>
      <div className="flex justify-between p-8 mt-12 mx-5 bg-blue-700">
        <div className="flex flex-col mt-12 ">
          <TiWeatherCloudy className="text-slate-300" size={70} />
          <h1 className="text-slate-300 uppercase">WEATHERZ</h1>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-white">Contact US!</h1>
          <input type="email" className="border-2 rounded-lg p-2" placeholder="Email" name="email" value={contact.email} onChange={handleContactChange} />
          <textarea row={8} placeholder="Your Message" className="border-2 p-2 rounded-lg" name="message" value={contact.message} onChange={handleContactChange} />
          <button className="bg-sky-400 text-white rounded-xl p-1" onClick={handlleContactSubmit}>Submit</button>
        </div>
      </div>
      <div className="bg-blue-600 fixed bottom-0 left-0 w-[100%] h-12">
        <h1 className="text-center text-white p-5">weatherz@gmail.com</h1>
      </div>
      <ToastContainer />
    </>
  )
}