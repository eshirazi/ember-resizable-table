# Ember Resizable Table

![Illustration](https://github.com/eshirazi/ember-resizable-table/raw/master/documentation/assets/demo1.gif)

Ember Resizable Table is a table component for Ember.js apps that allows users to resize the table's cells by dragging its borders. It's useful for creating split panels (i.e. for code editors).

## Installation

To install Ember Resizable Table, simply run:

`ember install ember-resizable-table`

at the root of your Ember CLI project.

## Demo Application

[A demo is available here](https://ember-resizable-table.herokuapp.com)

The demo uses the code from the `tests/dummy` folder of this addon: https://github.com/eshirazi/ember-resizable-table/tree/master/tests/dummy.


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

## Initial Column and Row Sizes

It's also possible to customize initial row and column sizes via the optional `initialColumnSizes` and `initialRowSizes` attributes.
The following example uses the [Ember Array Helper](https://github.com/kellyselden/ember-array-helper):

```handlebars
{{#resizable-table class="main-table"
    initialRowSizes=(array 0.5 0.25 0.25) 
    initialColumnSizes=(array 0.25 0.5 0.25) as |table|}}
  ...
{{/resizable-table}}
```

## Events

Event listeners are built to trigger Ember actions on component interactions and events.
To add an event listener, simply add an event attribute:

```handlebars
{{#resizable-table 
  onSizeChanged=(action "onSizeChanged")
  class="main-table" as |table|}}
  ...
{{/resizable-table}}
```

### onSizeChanged(columnOrRow, index, newSize)

Triggered whenever any column or row is resized.
- columnOrRow - Determines whether a row or a column was resized. The only possible values are ["column", "row"]. 
- index - A zero based index of the column or row that was resized.
- newSize - The new size of the row or column as a fraction of the table size - a value between 0 and 1.

## Contributions

Any contributions are welcome :) Check out our [project page on Github](https://github.com/eshirazi/ember-resizable-table).

### Demo Application

The demo application uses the [Heroku Buildpack for Ember.js](https://github.com/heroku/heroku-buildpack-emberjs).

Any changes to the master branch are automatically deployed to the demo application at: https://ember-resizable-table.herokuapp.com

