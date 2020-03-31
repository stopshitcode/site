// See about lodash in a Webpack, TypeScript project
// https://stackoverflow.com/questions/49036745/not-able-to-tree-shake-lodash-in-a-webpack-typescript-project
import filter from "lodash/filter";
import { UserProfile } from "./UserProfile";

console.log("Hello, World1");
console.log("Hello, World2");
console.log(filter("Hello, World", w => w !== "o").join());
console.log("Hello, World3");
console.log("Hello, World4");
console.log("Hello, World5");
console.log("Hello, World6");
console.log("Hello, World7");
console.log("Hello, World8");

// alert("Hello, World!!!");

window.onload = () => {
	(document as any).getElementById("logIn").onclick = UserProfile.authorize;
};
