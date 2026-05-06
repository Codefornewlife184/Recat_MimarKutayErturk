import React from 'react'
import About from './About.jsx'
import Services from './Services.jsx'
import HeroSlider from '../components/HeroSlider.jsx'
import NewHeroSlider from '../components/NewHeroSlider.jsx'
import Projects from './Projects.jsx'
import Comment from './Comment.jsx'
import Categories from './Categories.jsx'

export default function Home() {
  return (
    <div id="antra-smooth-wrapper">
      <div id="antra-smooth-content" className="home-page">
        <NewHeroSlider />
        <About />
        <Categories />
        <Comment />
      </div>
    </div>
  )
}
