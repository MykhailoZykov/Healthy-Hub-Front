import { useEffect, useState } from "react";
import FormDiary from "./FormDiary";
import { useFormik } from "formik";
import * as Yup from 'yup';

import {
  Overlay,
  ModalWindow,
  Header,
  Wrapper,
  Title,
  Button,
  ButtonActive,
  ButtonAddMore,
  WrapperButton
} from "./ModalDiary.styled";

const foodSchema = Yup.object().shape({
  foods: Yup.array().of(
    Yup.object().shape({
      name: Yup.string()
        .required('Enter the name of the product or dish')
        .min(2, 'Very short product name'),
      carbonohidrates: Yup.number()
        .required('Enter the amount of carbohydrates')
        .max(999.99, 'Maximum number is 999.99'),
      protein: Yup.number()
        .required('Enter the amount of protein')
        .max(999.99, 'Maximum number is 999.99'),
      fat: Yup.number()
        .required('Enter the amount of fat')
        .max(999.99, 'Maximum number is 999.99'),
      calories: Yup.number()
        .required('Enter the amount of calories')
        .max(999.99, 'Maximum number is 999.99'),
    })
  ),
});

const ModalDiary = ({ name, img, onClose }) => {
  const [diaryForms, setDiaryForms] = useState([{ key: 0 }]);

const formik = useFormik({
  initialValues: {
    foods: diaryForms.map((form) => form.initialValues),
  },
  validationSchema: foodSchema,
  onSubmit: (values) => {
    console.log(values);
    // Handle the form submission logic here
  },
});

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formik.isValid) {
      formik.handleSubmit(e);
      console.log(formik.values);
      onClose();
    } else {
      // Log and handle errors
      console.log(formik.values.foods);
    }
  };

  const handleAddMore = (e) => {
    e.preventDefault();
    const newKey = diaryForms.length;
    setDiaryForms((prevForms) => [
      ...prevForms,
      {
        key: newKey,
        initialValues: {
          name: "",
          carbonohidrates: "",
          protein: "",
          fat: "",
          calories: "",
        },
      },
    ]);
  };

  const handleResetForm = (key) => {
    formik.setFieldValue('foods', formik.values.foods.filter((_, i) => i !== key));
    setDiaryForms((prevForms) => prevForms.filter((form) => form.key !== key));
    
  };

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (e) => {
      if (e.code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalWindow>
        <Header>Record your meal</Header>
        <Wrapper>
          <img src={img} alt={name} />
          <Title>{name}</Title>
        </Wrapper>
        <form onSubmit={handleFormSubmit}>
          {diaryForms.map(({ key }) => (
            <FormDiary key={key} index={key} formik={formik} onDelete={handleResetForm} />
          ))}
          <ButtonAddMore onClick={handleAddMore}>+ Add more</ButtonAddMore>
          <WrapperButton>
            <ButtonActive type="submit">Confirm</ButtonActive>
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
          </WrapperButton>
        </form>
      </ModalWindow>
    </Overlay>
  );
};

export default ModalDiary;