const navMenu = document.querySelector(".nav-menu")
const mobileBtn = document.querySelector(".mobile-menu-btn")
const navLinks = document.querySelectorAll(".nav-link")
const close = document.querySelector(".close")

mobileBtn.addEventListener('click' , ()=>{
    navMenu.classList.add("active")
    mobileBtn.classList.add("active")
})

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active")
        mobileBtn.classList.remove("active")
    })
})

close.addEventListener("click", () => {
    navMenu.classList.remove("active")
    mobileBtn.classList.remove("active")
})
