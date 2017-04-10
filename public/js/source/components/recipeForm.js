const RecipeForm = React.createClass({
    getInitialState() {
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
    changeTitle(e) {
        this.setState({
            title: e.target.value
        });
    },
    changeDescription(e) {
        this.setState({ description: e.target.value });
    },
    addIngredient(e) {
        let ingredients = this
            .state
            .ingredients
            .concat([this.state.newIngredient]);

        this.setState({ ingredients: ingredients, newIngredient: "" });
    },
    changeNewIngredientText(e) {
        this.setState({ newIngredient: e.target.value });
    },
    addStep(e) {
        let steps = this
            .state
            .steps
            .concat([this.state.newStep]);

        this.setState({ steps: steps, newStep: "" });
    },
    changeNewStepText(e) {
        this.setState({ newStep: e.target.value });
    },
    processRecipe(e) {
        if (!this.state.title) {
            this.setState({ titleError: true});
            e.preventDefault();
            return false;
        };
        if (!this.state.description) {
            this.setState({ titleError: false, descriptionError: true});
            e.preventDefault();
            return false;
        };
        if (this.state.ingredients.length == 0) {
            this.setState({titleError: false, descriptionError: false, stepError: false, ingredientError: true});
            e.preventDefault();
            return false;
        };
        if (this.state.steps.length == 0) {
            this.setState({ titleError: false, descriptionError: false, stepError: true});
            e.preventDefault();
            return false;
        };
        let flag = false;
         (this.props.list || []).map((data) => {
             debugger;
            if (data.title === this.state.title){

                flag = true;
            }
        });

         if(flag){
             this.setState({titleError: false, descriptionError: false, stepError: false, ingredientError: false, repeatTitleError: true});
             e.preventDefault();

             return false;
         }

        const recipeObj = {};
        (this.state.title) ? recipeObj.title = this.state.title : null;
        (this.state.description) ? recipeObj.description = this.state.description : null;
        (this.state.ingredients) ? recipeObj.ingredients = this.state.ingredients : null;
        (this.state.steps) ? recipeObj.steps = this.state.steps : null;

        $.ajax({
            url: "/recipes",
            type: "POST",
            data: {recipe: recipeObj},
            dataType: 'json',
            cache: false,
            success: function(data)
            {

            },
            error: function (request, status, error) {

                console.log(error);
            }
        });
        return true;

    },
    showError() {
        if (this.state.titleError) {
            return (
                <div className="alert alert-danger">
                    Please Enter Title of the Recipe!
                </div>
            );
        }
        if (this.state.descriptionError) {
            return (
                <div className="alert alert-danger">
                    Please Enter Description of the Recipe!
                </div>
            );
        }
        if (this.state.stepError) {
            return (
                <div className="alert alert-danger">
                    Please Enter atleast ONE Step of the Recipe!
                </div>
            );
        }
        if (this.state.ingredientError) {
            return (
                <div className="alert alert-danger">
                    Please Enter atleast ONE Ingredient of the Recipe!
                </div>
            );
        }
        if (this.state.repeatTitleError) {
            return (
                <div className="alert alert-danger">
                    Recipe already Exist! Please add some NEW Recipe!
                </div>
            );
        }
    },
    render() {
        let newTitleText = `New Recipe: ${this.state.title || ''} (${this.state.ingredients.length} ingredients, ${this.state.steps.length} steps)`;
        return (<form onSubmit={this.processRecipe.bind(this)} ref="recipeForms">
            <div className="recipe">
                <h3>Add a New Recipe</h3>
                <div className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="newTitle" className="col-sm-3 control-label">Title</label>
                        <div className="col-sm-9">
                            <input
                                ref="title"
                                className="form-control"
                                id="newTitle"
                                placeholder="New Recipe"
                                onChange={this.changeTitle}
                                value={this.state.title}
                                type="text"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newDescription" className="col-sm-3 control-label">Description</label>
                        <div className="col-sm-9">
                            <textarea
                                className="form-control"
                                id="newDescription"
                                ref="description"
                                placeholder="Recipe description"
                                onChange={this.changeDescription}></textarea>

                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newIngredientText" className="col-sm-3 control-label">New Ingredient</label>
                        <div className="col-sm-9">
                            <div className="input-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    ref="ingredients"
                                    id="newIngredientText"
                                    placeholder="New Ingredient"
                                    value={this.state.newIngredient}
                                    onChange={this.changeNewIngredientText}
                                />
                                <span className="input-group-btn">
                                    <button className="btn btn-primary" type="button" onClick={this.addIngredient}>Add Ingredient</button>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newStepText" className="col-sm-3 control-label">New Step</label>
                        <div className="col-sm-9">
                            <textarea
                                className="form-control"
                                type="text"
                                ref="step"
                                id="newStepText"
                                placeholder="New Step Instructions"
                                value={this.state.newStep}
                                onChange={this.changeNewStepText}></textarea>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-3 col-sm-9">
                            <button className="btn btn-primary" type="button" onClick={this.addStep}>Add Step</button>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-12">
                            <button type="submit" className="btn btn-default">Add Recipe</button>
                        </div>
                    </div>
                </div>
                {this.showError()}
                <Recipe
                    title={newTitleText}
                    description={this.state.description}
                    steps={this.state.steps}
                    ingredients={this.state.ingredients}
                />
            </div>
        </form>);
    }
});
