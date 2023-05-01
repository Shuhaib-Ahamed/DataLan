from pycaret.classification import *


class AutoML:
    def __init__(self, path_to_data: str, target_column: str, metric):
        self.df = path_to_data
        self.target_column = target_column
        self.metric = metric
        self.best_model = None

    async def fit(self):
        clf = setup(data=self.df, target=self.target_column,
                    session_id=42, html=False, verbose=False)
        top5_models = compare_models(n_select=5)
        tuned_top5_models = [tune_model(model) for model in top5_models]

        bagged_tuned_top5_models = [ensemble_model(
            model, method="Bagging") for model in tuned_top5_models]
        blended = blend_models(estimator_list=top5_models)
        stacked = stack_models(
            estimator_list=top5_models[1:], meta_model=top5_models[0])
        best_model = automl(optimize=self.metric)
        self.best_model = best_model
        save_model(best_model, "best_model")
