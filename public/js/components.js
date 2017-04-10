"use strict";

var Recipe = React.createClass({
  displayName: "Recipe",

  getInitialState: function getInitialState() {
    return { showingDetails: false };
  },
  showMore: function showMore(e) {
    e.preventDefault();
    this.setState({ showingDetails: true });
  },
  showLess: function showLess(e) {
    e.preventDefault();
    this.setState({ showingDetails: false });
  },
  render: function render() {
    var bodyContent = undefined;
    var toggler = undefined;
    if (this.state.showingDetails) {
      var steps = this.props.steps.map(function (step) {
        return React.createElement(
          "li",
          null,
          step
        );
      });

      var ingredients = this.props.ingredients.map(function (step) {
        return React.createElement(
          "li",
          null,
          step
        );
      });

      bodyContent = React.createElement(
        "div",
        null,
        React.createElement(
          "p",
          null,
          this.props.description
        ),
        React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            "div",
            { className: "col-md-8" },
            React.createElement(
              "ol",
              null,
              steps
            )
          ),
          React.createElement(
            "div",
            { className: "col-sm-4" },
            React.createElement(
              "ul",
              null,
              ingredients
            )
          )
        )
      );
      toggler = React.createElement(
        "p",
        { className: "text-center" },
        React.createElement(
          "a",
          { onClick: this.showLess, href: "" },
          "Show Less"
        )
      );
    } else {
      var words = this.props.description.split(' ');
      bodyContent = React.createElement(
        "p",
        null,
        words.slice(0, 35).join(" "),
        words.length > 35 ? '... ' : undefined,
        words.length > 35 ? React.createElement(
          "a",
          { onClick: this.showMore },
          "read on"
        ) : undefined
      );

      toggler = React.createElement(
        "p",
        { className: "text-center" },
        React.createElement(
          "a",
          { onClick: this.showMore, href: "" },
          "Show Details"
        )
      );
    }

    return React.createElement(
      "div",
      { className: "panel panel-default" },
      React.createElement(
        "div",
        { className: "panel-heading" },
        this.props.title
      ),
      React.createElement(
        "div",
        { className: "panel-body" },
        bodyContent,
        toggler
      )
    );
  }
});
"use strict";

var RecipeForm = React.createClass({
    displayName: "RecipeForm",
    getInitialState: function getInitialState() {
        return {
            title: "",
            description: "",
            steps: [],
            ingredients: [],
            newIngredient: "",
            titleError: false,
            descriptionError: false,
            stepError: false,
            ingredientError: false,
            repeatTitleError: false
        };
    },
    changeTitle: function changeTitle(e) {
        this.setState({
            title: e.target.value
        });
    },
    changeDescription: function changeDescription(e) {
        this.setState({ description: e.target.value });
    },
    addIngredient: function addIngredient(e) {
        var ingredients = this.state.ingredients.concat([this.state.newIngredient]);

        this.setState({ ingredients: ingredients, newIngredient: "" });
    },
    changeNewIngredientText: function changeNewIngredientText(e) {
        this.setState({ newIngredient: e.target.value });
    },
    addStep: function addStep(e) {
        var steps = this.state.steps.concat([this.state.newStep]);

        this.setState({ steps: steps, newStep: "" });
    },
    changeNewStepText: function changeNewStepText(e) {
        this.setState({ newStep: e.target.value });
    },
    processRecipe: function processRecipe(e) {
        var _this = this;

        if (!this.state.title) {
            this.setState({ titleError: true });
            e.preventDefault();
            return false;
        };
        if (!this.state.description) {
            this.setState({ titleError: false, descriptionError: true });
            e.preventDefault();
            return false;
        };
        if (this.state.ingredients.length == 0) {
            this.setState({ titleError: false, descriptionError: false, stepError: false, ingredientError: true });
            e.preventDefault();
            return false;
        };
        if (this.state.steps.length == 0) {
            this.setState({ titleError: false, descriptionError: false, stepError: true });
            e.preventDefault();
            return false;
        };
        var flag = false;
        (this.props.list || []).map(function (data) {
            debugger;
            if (data.title === _this.state.title) {

                flag = true;
            }
        });

        if (flag) {
            this.setState({ titleError: false, descriptionError: false, stepError: false, ingredientError: false, repeatTitleError: true });
            e.preventDefault();

            return false;
        }

        var recipeObj = {};
        this.state.title ? recipeObj.title = this.state.title : null;
        this.state.description ? recipeObj.description = this.state.description : null;
        this.state.ingredients ? recipeObj.ingredients = this.state.ingredients : null;
        this.state.steps ? recipeObj.steps = this.state.steps : null;

        $.ajax({
            url: "/recipes",
            type: "POST",
            data: { recipe: recipeObj },
            dataType: 'json',
            cache: false,
            success: function success(data) {},
            error: function error(request, status, _error) {

                console.log(_error);
            }
        });
        return true;
    },
    showError: function showError() {
        if (this.state.titleError) {
            return React.createElement(
                "div",
                { className: "alert alert-danger" },
                "Please Enter Title of the Recipe!"
            );
        }
        if (this.state.descriptionError) {
            return React.createElement(
                "div",
                { className: "alert alert-danger" },
                "Please Enter Description of the Recipe!"
            );
        }
        if (this.state.stepError) {
            return React.createElement(
                "div",
                { className: "alert alert-danger" },
                "Please Enter atleast ONE Step of the Recipe!"
            );
        }
        if (this.state.ingredientError) {
            return React.createElement(
                "div",
                { className: "alert alert-danger" },
                "Please Enter atleast ONE Ingredient of the Recipe!"
            );
        }
        if (this.state.repeatTitleError) {
            return React.createElement(
                "div",
                { className: "alert alert-danger" },
                "Recipe already Exist! Please add some NEW Recipe!"
            );
        }
    },
    render: function render() {
        var newTitleText = "New Recipe: " + (this.state.title || '') + " (" + this.state.ingredients.length + " ingredients, " + this.state.steps.length + " steps)";
        return React.createElement(
            "form",
            { onSubmit: this.processRecipe.bind(this), ref: "recipeForms" },
            React.createElement(
                "div",
                { className: "recipe" },
                React.createElement(
                    "h3",
                    null,
                    "Add a New Recipe"
                ),
                React.createElement(
                    "div",
                    { className: "form-horizontal" },
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "label",
                            { htmlFor: "newTitle", className: "col-sm-3 control-label" },
                            "Title"
                        ),
                        React.createElement(
                            "div",
                            { className: "col-sm-9" },
                            React.createElement("input", {
                                ref: "title",
                                className: "form-control",
                                id: "newTitle",
                                placeholder: "New Recipe",
                                onChange: this.changeTitle,
                                value: this.state.title,
                                type: "text" })
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "label",
                            { htmlFor: "newDescription", className: "col-sm-3 control-label" },
                            "Description"
                        ),
                        React.createElement(
                            "div",
                            { className: "col-sm-9" },
                            React.createElement("textarea", {
                                className: "form-control",
                                id: "newDescription",
                                ref: "description",
                                placeholder: "Recipe description",
                                onChange: this.changeDescription })
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "label",
                            { htmlFor: "newIngredientText", className: "col-sm-3 control-label" },
                            "New Ingredient"
                        ),
                        React.createElement(
                            "div",
                            { className: "col-sm-9" },
                            React.createElement(
                                "div",
                                { className: "input-group" },
                                React.createElement("input", {
                                    className: "form-control",
                                    type: "text",
                                    ref: "ingredients",
                                    id: "newIngredientText",
                                    placeholder: "New Ingredient",
                                    value: this.state.newIngredient,
                                    onChange: this.changeNewIngredientText
                                }),
                                React.createElement(
                                    "span",
                                    { className: "input-group-btn" },
                                    React.createElement(
                                        "button",
                                        { className: "btn btn-primary", type: "button", onClick: this.addIngredient },
                                        "Add Ingredient"
                                    )
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "label",
                            { htmlFor: "newStepText", className: "col-sm-3 control-label" },
                            "New Step"
                        ),
                        React.createElement(
                            "div",
                            { className: "col-sm-9" },
                            React.createElement("textarea", {
                                className: "form-control",
                                type: "text",
                                ref: "step",
                                id: "newStepText",
                                placeholder: "New Step Instructions",
                                value: this.state.newStep,
                                onChange: this.changeNewStepText })
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "div",
                            { className: "col-sm-offset-3 col-sm-9" },
                            React.createElement(
                                "button",
                                { className: "btn btn-primary", type: "button", onClick: this.addStep },
                                "Add Step"
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "div",
                            { className: "col-sm-12" },
                            React.createElement(
                                "button",
                                { type: "submit", className: "btn btn-default" },
                                "Add Recipe"
                            )
                        )
                    )
                ),
                this.showError(),
                React.createElement(Recipe, {
                    title: newTitleText,
                    description: this.state.description,
                    steps: this.state.steps,
                    ingredients: this.state.ingredients
                })
            )
        );
    }
});
"use strict";

var RecipeList = React.createClass({
    displayName: "RecipeList",

    getInitialState: function getInitialState() {
        return { recipes: [] };
    },
    componentDidMount: function componentDidMount() {
        var _this = this;

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function success(recipeList) {
                _this.setState({ recipes: recipeList });
            },
            error: function error(xhr, status, err) {
                console.error(_this.props.url, status, err.toString());
            }
        });
    },
    render: function render() {
        var recipeList = this.state.recipes;
        var recipes = recipeList.map(function (recipe) {
            return React.createElement(Recipe, {
                key: recipe.id,
                title: recipe.title,
                description: recipe.description,
                id: recipe.id,
                steps: recipe.steps,
                ingredients: recipe.ingredients });
        });

        return React.createElement(
            "div",
            { className: "recipe" },
            recipes,
            React.createElement("hr", null),
            React.createElement(RecipeForm, { list: this.state.recipes })
        );
    }
});

ReactDOM.render(React.createElement(RecipeList, { url: "/recipes" }), document.getElementById('content'));
