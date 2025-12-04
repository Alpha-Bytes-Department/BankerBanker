# Project instruction

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
| `text` | `string` | **Required**. Your API key |

### Description

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |


### BlackButonRightIcon

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |
