# Project instruction

## Folder guide
- keep all shared component in component folder
- keep all single used component in _component folder

## Color Reference

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Primary Color | #0D4DA5 |
| Example Color | #000000 |

## Custom Component Reference

### Usage/Examples

```javascript
import Headline from '@/components/Headline';

function App() {
  return <div><Headline text="How It Works" /></div>
}
```

### Button

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `text` | `string` | Button name |
| `onClick` | `() => void` | Function for the button |
| `className` | `string` | There is some default style in button. In className you can pass parameter `button-primary` or `button-secondary` or `button-none` this style are setted in globals css as veriable |
| `width` | `string` | Width can be in px, %, em, rem, anything else. It doesn't affecet other desing |
| `type`  | `button` or `submit` or `reset` | Set button active according to need. Like for form submit pass `submit` in the type props|
| `icon` | `boolean` | if you need icon you have to pass `icon = {true}` other wise `false` |

### Headline

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `text` | `string` | Pass the headline text  |
| `className` | `string` | There have default text size `text-4xl` you can pass any styles. If you pass you have to send text size also |

### Description

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `text` | `string` | Pass the headline text  |
| `className` | `string` | There have default  `className="text-xl text-center"` you can pass any styles. Default will replaced if you pass any className |
| `position` | "left" | "right" | "center" | "justify" | set positon accoding to need


### BlackButonRightIcon

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `buttonName` | `string` | **Required**. Must have to pass buttonName |
| `iconName` | `iconType` | **Required**. ForExample  `IconType` from react-icon or React.ReactNode |
| `width` | `string` | width of the button.|
| `rounded` | `string` | border radius of the button |

