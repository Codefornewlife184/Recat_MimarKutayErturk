import React from 'react'

export default function Slider() {

  return (
    <section className="slider-section overflow-hidden">
            <div className="antra-slider swiper-container">
                <div className="swiper-wrapper">
                    <div className="swiper-slide">
                        <div className="slider-item">
                            <div className="bg-img" data-background="assets/img/bg-img/slider-img-1.png" style="background-image: url(assets/img/bg-img/slider-img-1.png)"></div>
                            <div className="container slider-container">
                                <div className="slider-content-wrap">
                                    <div className="slider-content">
                                        <div className="section-heading white-content">
                                            <h4 className="sub-heading" data-animation="antra-fadeInDown" data-delay="1000ms" data-duration="1400ms">FAST AND RELIABLE</h4>
                                            <h2 className="section-title cursor-effect" data-animation="antra-fadeInDown" data-delay="1200ms" data-duration="1400ms">The Art of Stunning <br/> Interior Design</h2>
                                        </div>
                                        <div className="bottom-content">
                                            <div className="antra-desc" data-animation="antra-fadeInUp" data-delay="1000ms" data-duration="1400ms">
                                                <p>Whether it's your home, office, or a commercial <br/> project, we are always dedicated to bringing <br/> your vision to life.</p>
                                            </div>
                                            <div className="antra-btn"  data-animation="antra-fadeInUp" data-delay="1200ms" data-duration="1400ms">
                                                <a href="contact.html" className="tl-primary-btn white-btn">Take counsel <span className="icon"><i className="fa-regular fa-arrow-right"></i></span></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="slider-element-wrap" data-animation="antra-fadeInRight" data-delay="1300ms" data-duration="1300ms">
                                <div className="slider-element">
                                    <h3 className="element-title">260+</h3>
                                    <span>Successful projects <br/> and counting</span>
                                    <p>Tech Specifications <br/>Design Project <br/>3D visualisation</p>
                                </div>
                                <div className="slider-thumb">
                                    <img src="assets/img/images/slider-thumb-1.png" alt="slider"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="swiper-slide">
                        <div className="slider-item">
                            <div className="bg-img" data-background="assets/img/bg-img/slider-img-2.png" style="background-image: url(assets/img/bg-img/slider-img-2.png)"></div>
                            <div className="container slider-container">
                                <div className="slider-content-wrap">
                                    <div className="slider-content">
                                        <div className="section-heading white-content">
                                            <h4 className="sub-heading" data-animation="antra-fadeInDown" data-delay="1000ms" data-duration="1400ms">FAST AND RELIABLE</h4>
                                            <h2 className="section-title cursor-effect" data-animation="antra-fadeInDown" data-delay="1200ms" data-duration="1400ms">The Art of Stunning <br/> Interior Design</h2>
                                        </div>
                                        <div className="bottom-content">
                                            <div className="antra-desc" data-animation="antra-fadeInUp" data-delay="1000ms" data-duration="1400ms">
                                                <p>Whether it's your home, office, or a commercial <br/> project, we are always dedicated to bringing <br/> your vision to life.</p>
                                            </div>
                                            <div className="antra-btn"  data-animation="antra-fadeInUp" data-delay="1200ms" data-duration="1400ms">
                                                <a href="contact.html" className="tl-primary-btn white-btn">Take counsel <span className="icon"><i className="fa-regular fa-arrow-right"></i></span></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="slider-element-wrap" data-animation="antra-fadeInRight" data-delay="1300ms" data-duration="1300ms">
                                <div className="slider-element">
                                    <h3 className="element-title">260+</h3>
                                    <span>Successful projects <br/> and counting</span>
                                    <p>Tech Specifications <br/>Design Project <br/>3D visualisation</p>
                                </div>
                                <div className="slider-thumb">
                                    <img src="assets/img/images/slider-thumb-1.png" alt="slider"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
  )
}
