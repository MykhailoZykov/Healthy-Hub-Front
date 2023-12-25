import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FaArrowLeftLong } from 'react-icons/fa6';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { ErrorToast, SuccessToast } from '../../../../../Redux/User/toast';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler,
} from 'chart.js';
import {
  ContainerChart,
  ContainerSelect,
  ContainerValue,
  Month,
  TitleCalories,
  TitleWater,
  TitleWeight,
  BackIconContainer,
  BackIconLink,
  ChartsWrapper,
  Wrapper,
  Value,
  Span,
  ContainerWeightChart,
  WeightWrapper,
  Upper,
  WeightWrap,
  LowerWrap,
  UpperValue,
  LowerValue,
  customSelectStyles,
  FlexContainer,
} from './Charts.styled';
import {
  caloriesOptions,
  waterOptions,
  chartLineOptions,
} from './chartOptions';
import { monthCurrent } from '../../../../../utilities/monthCurrent';
import { monthValue } from '../../../../../utilities/monthValue';
import { userStatistics } from '../../../../../Redux/User/userThunks';
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler
);
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const Charts = () => {
  const dispatch = useDispatch();
  const [selectedMonth, setSelectedMonth] = useState(monthCurrent());
  const [chartData, setChartData] = useState(null);
  const [waterChartData, setWaterChartData] = useState(null);
  const [weightChartData, setWeightChartData] = useState({
    upperRowValues: [],
    lowerRowValues: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(userStatistics({ month: selectedMonth }));
        console.log('Fetched DATA:', data); // -------------------------------------- !
        updateCaloriesChartData(data);
        updateWaterChartData(data);
        updateWeightChartData(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        toast.error(<ErrorToast message="Error fetching statistics." />);
      }
    };
    fetchData();
  }, [dispatch, selectedMonth]);

  const handleSelectChange = (selectedOption) => {
    try {
      setSelectedMonth(selectedOption.label);
    } catch (error) {
      console.error('Error handling select change:', error);
      toast.error(<ErrorToast message="Error handling select change." />);
    }
  };

  const getCurrentDayOfMonth = () => {
    const currentDate = new Date();
    return currentDate.getDate();
  };

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const date = `${year}-${month}-${day}`;

  // CALORIES CONFIG

  const updateCaloriesChartData = ({ payload }) => {
    if (!payload || !payload.stats) {
      console.error('Data is missing or does not have the expected format.');
      toast.error(
        <ErrorToast message="Data is missing or has an unexpected format." />
      );
      return;
    }

    const dataForSelectedMonth = payload.stats;
    
    const numberOfDaysInMonth = new Date(
      year,
      monthValue(selectedMonth),
      0
    ).getDate();

    const monthEntries = dataForSelectedMonth.filter(
      (entry) =>
        new Date(entry.date).getMonth() === monthValue(selectedMonth) - 1
    );

    setChartData({
      labels: Array.from({ length: numberOfDaysInMonth }, (_, i) => `${i + 1}`),
      datasets: [
        {
          label: selectedMonth,
          data: monthEntries.map((entry) => entry.totalCalories),
          ...chartLineOptions,
        },
      ],
    });
  };

  // WATER CONFIG

  const updateWaterChartData = ({ payload }) => {
    if (!payload || !payload.stats) {
      console.error('Data is missing or does not have the expected format.');
      toast.error(
        <ErrorToast message="Data is missing or has an unexpected format." />
      );
      return;
    }

    const dataForSelectedMonth = payload.stats;
    const numberOfDaysInMonth = new Date(
      year,
      monthValue(selectedMonth),
      0
    ).getDate();

    const monthEntries = dataForSelectedMonth.filter(
      (entry) =>
        new Date(entry.date).getMonth() === monthValue(selectedMonth) - 1
    );

    setWaterChartData({
      labels: Array.from({ length: numberOfDaysInMonth }, (_, i) => `${i + 1}`),
      datasets: [
        {
          label: selectedMonth,
          data: monthEntries.map((entry) => entry.water),
          ...chartLineOptions,
        },
      ],
    });
  };

  // WEIGHT CONFIG

  const updateWeightChartData = (data) => {
    if (!data || !data.payload || !data.payload.stats) {
      console.error('Data is missing or does not have the expected format.');
      toast.error(
        <ErrorToast message="Data is missing or has an unexpected format." />
      );
      return;
    }

    const dataForSelectedMonth = data.payload.stats;
    const daysInMonth = new Date(year, monthValue(selectedMonth), 0).getDate();

    const dayEntries = Array.from({ length: daysInMonth }, (_, i) => {
      const entryDate = new Date(year, monthValue(selectedMonth) - 1, i + 1);
      const dayEntry = dataForSelectedMonth.find(
        (entry) =>
          new Date(entry.date.replace(/-/g, '/')).getTime() ===
          entryDate.getTime()
      );
      return dayEntry;
    });

    let lastEnteredValue = null;
    const weightValues = dayEntries.map((entry, index) => {
      if (entry && entry.weight !== undefined) {
        lastEnteredValue = entry.weight;
        return entry.weight;
      } else if (entry && index + 1 === getCurrentDayOfMonth()) {
        return lastEnteredValue !== null ? lastEnteredValue : null;
      }
      return null;
    });

    const validWeightValues = weightValues
      .slice(0, getCurrentDayOfMonth())
      .filter((value) => value !== null);
    const sumWeight = validWeightValues.reduce(
      (acc, val) => acc + (val || 0),
      0
    );
    const averageWeight =
      validWeightValues.length > 0
        ? sumWeight / validWeightValues.length
        : null;
    setWeightChartData({
      upperRowValues: weightValues,
      lowerRowValues: Array.from({ length: daysInMonth }, (_, i) =>
        (i + 1).toString()
      ),
      averageWeight: averageWeight !== null ? averageWeight.toFixed(0) : null,
    });
  };

  // SELECT CONFIG

  const selectOptions = () => {
    const currentIndex = months.findIndex((month) => month === monthCurrent());
    const availableMonths = months
      .slice(Math.max(0, currentIndex - 4), currentIndex + 1)
      .reverse();
    return availableMonths.map((month) => ({
      value: month,
      label: month,
    }));
  };

  return (
    <>
      <ContainerSelect>
        <BackIconContainer>
          <BackIconLink to="/main">
            <FaArrowLeftLong />
          </BackIconLink>
          {/* SELECT */}
          <label>
            <Select
              value={{ value: selectedMonth, label: 'Month' }}
              onChange={handleSelectChange}
              options={selectOptions()}
              placeholder="Month"
              styles={customSelectStyles}
              isSearchable={false}
              readOnly
            />
          </label>
        </BackIconContainer>
        {/* Current month */}
        {selectedMonth && <Month>{selectedMonth}</Month>}
      </ContainerSelect>

      <FlexContainer>
        <Wrapper>
          <ChartsWrapper>
            <ContainerValue>
              <TitleCalories>Calories</TitleCalories>
              {/* Average value */}
              {chartData && (
                <Value>
                  <Span>Average value:</Span>{' '}
                  {Math.round(
                    chartData.datasets[0].data.reduce(
                      (acc, val) => acc + val,
                      0
                    ) / getCurrentDayOfMonth()
                  )}{' '}
                  <>calories</>
                </Value>
              )}
            </ContainerValue>

            {/* CALORIES Chart */}
            <ContainerChart>
              {chartData && chartData.datasets && (
                <Line data={chartData} options={caloriesOptions} />
              )}
            </ContainerChart>
          </ChartsWrapper>

          <ChartsWrapper>
            <ContainerValue>
              <TitleWater>Water</TitleWater>
              {/* Average value */}
              {waterChartData && (
                <Value>
                  <Span>Average value:</Span>{' '}
                  {Math.round(
                    waterChartData.datasets[0].data.reduce(
                      (acc, val) => acc + val,
                      0
                    ) / getCurrentDayOfMonth()
                  )}{' '}
                  <>ml</>
                </Value>
              )}
            </ContainerValue>

            {/* WATER Chart */}
            <ContainerChart>
              {' '}
              {waterChartData && waterChartData.datasets && (
                <Line data={waterChartData} options={waterOptions} />
              )}
            </ContainerChart>
          </ChartsWrapper>
        </Wrapper>

        <WeightWrapper>
          <ContainerValue>
            <TitleWeight>Weight</TitleWeight>
            {/* Average value */}
            {weightChartData && weightChartData.averageWeight !== null && (
              <Value>
                <Span>Average value:</Span> {weightChartData.averageWeight} kg
              </Value>
            )}
          </ContainerValue>

          {/* WEIGHT Chart */}
          {weightChartData && (
            <ContainerWeightChart>
              <WeightWrap>
                <Upper>
                  {weightChartData.upperRowValues.map((value, index) => (
                    <UpperValue key={index}>
                      {value !== null ? value : ''}
                    </UpperValue>
                  ))}
                </Upper>
                <LowerWrap>
                  {weightChartData.lowerRowValues.map((value, index) => (
                    <LowerValue key={index}>{value}</LowerValue>
                  ))}
                </LowerWrap>
              </WeightWrap>
            </ContainerWeightChart>
          )}
        </WeightWrapper>
      </FlexContainer>
    </>
  );
};

export default Charts;
