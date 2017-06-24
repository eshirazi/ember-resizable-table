# Ember Resizable Table

![Illustration](https://github.com/eshirazi/ember-resizable-table/raw/master/documentation/assets/demo1.gif)

Ember Resizable Table is a table component for Ember.js apps that allows users to resize the table's cells by dragging its borders. It's useful for creating split panels (i.e. for code editors).

## Installation

To install Ember Resizable Table, simply run:

`ember install ember-resizable-table`

at the root of your Ember CLI project.

## Usage Example

A simple usage of a table with colorful table cells (this is the code for creating the animated illustration above):

.hbs:
```handlebars
{{#resizable-table class="main-table" as |table|}}
  {{#table.tr as |row|}}
    {{row.td class="color1" rowSpan=2}}
    {{row.td class="color2"}}
    {{row.td class="color3"}}
  {{/table.tr}}
  {{#table.tr as |row|}}
    {{row.td class="color4" rowSpan=2 colSpan=2}}
  {{/table.tr}}
  {{#table.tr as |row|}}
    {{row.td class="color5"}}
  {{/table.tr}}
{{/resizable-table}}
```

.css:
```css
.main-table {
  width: 400px;
  height: 400px;
  border-collapse: collapse;
}

.main-table td {
  border: 3px solid #fff;
}

.color1 {  background: #0074D9; }
.color2 {  background: #FF4136; }
.color3 {  background: #85144b; }
.color4 {  background: #39CCCC; }
.color5 {  background: #01FF70; }
```

## Example Project

An example project can be found inside the `tests/dummy` folder of this addon: https://github.com/eshirazi/ember-resizable-table/tree/master/tests/dummy.

## Contributions

Any contributions are welcome :) Check out our [project page on Github](https://github.com/eshirazi/ember-resizable-table).
