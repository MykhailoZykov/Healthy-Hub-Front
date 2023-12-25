import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { requestFoodIntakeThunk } from "../../Redux/Diary/diaryThunks";
import { selectorIntake } from "../../Redux/Diary/selectors";
import { ItemNutrients, NutrientsList } from "./ListNutritients.styled"

const ListNutritients = ({name}) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(requestFoodIntakeThunk())
    },[dispatch])

    const intake = useSelector(selectorIntake);
    let selectedIntake;
    switch (name) {
      case "breakfast":
        selectedIntake = intake.breakfast;
        break;
      case "lunch":
        selectedIntake = intake.lunch;
        break;
      case "dinner":
        selectedIntake = intake.dinner;
        break;
      case "snack":
        selectedIntake = intake.snack;
        break;
      default:
        selectedIntake = null;
        break;
    }

    const totalCarbs = selectedIntake && selectedIntake.totalCarbs !== undefined ? selectedIntake.totalCarbs : 0;
    const totalProtein = selectedIntake && selectedIntake.totalProtein !== undefined ? selectedIntake.totalProtein : 0;
    const totalFat = selectedIntake && selectedIntake.totalFat !== undefined ? selectedIntake.totalFat : 0;

    return(
    <NutrientsList>
        <ItemNutrients>Carbonohidrates: <span>{totalCarbs}</span></ItemNutrients>
        <ItemNutrients>Protein: <span>{totalProtein}</span></ItemNutrients>
        <ItemNutrients>Fat: <span>{totalFat}</span></ItemNutrients>
    </NutrientsList>
    )
}

export default ListNutritients;