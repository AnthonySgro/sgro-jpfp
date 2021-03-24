import React, { Component } from "react";

// Component Imports
import Icon from "./Icon.jsx";

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.typewriter = this.typewriter.bind(this);
    }

    componentDidMount() {
        this.typewriter();
    }

    // Handles homepage typing animation
    // Original source idea: https://codepen.io/hi-im-si/pen/DHoup
    typewriter() {
        // This is a class that handles the text on the screen
        class TxtType {
            constructor(el, toRotate, period) {
                this.toRotate = toRotate;
                this.el = el;
                this.loopNum = 0;
                this.period = parseInt(period, 10) || 2000;
                this.txt = "";
                this.isDeleting = false;
                this.tick();
            }
        }

        // Tick function that types (or deletes) a new letter at a random increment
        TxtType.prototype.tick = function () {
            const i = this.loopNum % this.toRotate.length;
            const fullTxt = this.toRotate[i];

            // If deleting, remove a letter
            if (this.isDeleting) {
                this.txt = fullTxt.substring(0, this.txt.length - 1);
                // Else, append one
            } else {
                this.txt = fullTxt.substring(0, this.txt.length + 1);
            }

            // Re-render the inner text every time
            this.el.innerHTML = "<span>" + this.txt + "</span>";

            // Get reference to our TxtType class
            const that = this;

            // Generates random increment to simulate typewriter effect
            let delta = 200 - Math.random() * 100;

            // If deleting, we will double the speed
            if (this.isDeleting) {
                delta /= 2;
            }

            // If we reach the full text, start deleting
            if (!this.isDeleting && this.txt === fullTxt) {
                delta = this.period;
                this.isDeleting = true;
                // If we reach empty, start next string
            } else if (this.isDeleting && this.txt === "") {
                this.isDeleting = false;
                this.loopNum++;

                // And take a half second pause
                delta = 500;
            }

            // Action timer
            setTimeout(() => {
                that.tick();
            }, delta);
        };

        // When window loads (it should since this gets called after the component mounts)
        const startEffect = () => {
            // Get our element that does the effect
            const elements = document.getElementsByClassName("typewrite");

            // If we decide to put more in later
            for (let i = 0; i < elements.length; i++) {
                const toRotate = elements[i].getAttribute("data-type");
                const period = elements[i].getAttribute("data-period");

                // If we have something in our data-type attribute, we must cycle through it
                if (toRotate) {
                    new TxtType(elements[i], JSON.parse(toRotate), period);
                }
            }
            // Create a style element
            let css = document.createElement("style");

            // Give it our
            css.innerHTML = ".typewrite > { border-right: 0.08em solid #fff}";
            // Append the style element to the html doc
            document.body.appendChild(css);
        };

        startEffect();
    }

    render() {
        const IMAGE_FILES = [
            { filename: "/images/calculator.png", size: "wide" },
            { filename: "/images/bus.png", size: "wide" },
            { filename: "/images/book.png", size: "wide" },
            { filename: "/images/database.png", size: "wide" },
            { filename: "/images/graduationCap.png", size: "thin" },
            { filename: "/images/secret.png", size: "thin" },
            { filename: "/images/teacher.png", size: "thin" },
            { filename: "/images/testtude.png", size: "wide" },
            { filename: "/images/university.png", size: "thin" },
        ];

        return (
            <main>
                <div id="homepage-lander">
                    <div id="homepage-top-text">
                        <p className="sub-heading-text">
                            The Illuminati's Backdoor to College
                        </p>
                    </div>
                    <div id="big-text-homepage">
                        <h1>
                            UniBase<span id="logo-period">.</span>
                        </h1>
                    </div>
                    <div id="homepage-btn-container">
                        <button id="homepage-btn">
                            <p>Browse Campuses</p>
                        </button>
                        <p
                            className="typewrite"
                            data-period="2000"
                            data-type='[ "Steal an Ivy League diploma.", "Flunk the neighbors kid.", "Destroy a public school.", "Boost your childs grades", "You deserve it." ]'
                        >
                            {/* Typewriter effect here */}
                            <span></span>
                        </p>
                    </div>
                    <footer id="image-tray">
                        {IMAGE_FILES.map((img, i) => {
                            const type = (i + 1) % 2 ? "odd" : "even";
                            return <Icon key={i} type={type} {...img} />;
                        })}
                    </footer>
                </div>
            </main>
        );
    }
}

export default HomePage;
