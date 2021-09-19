import { sideNav } from "./visual-elements";

export function OpenSideMenu (e: Event) {
    sideNav.style.width = "250px";
    sideNav.focus();
}

export function CloseSideMenu (e: Event) {
    console.log(e.type.toString());
    
    sideNav.style.width = "0px";
}

export function InitElements(){

}