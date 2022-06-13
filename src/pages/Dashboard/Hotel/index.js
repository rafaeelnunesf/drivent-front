import { Box } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { InfoType, Info, HotelButton, HotelName } from '../../../components/Dashboard/HotelsButton';
import PageTitle from '../../../components/Dashboard/PageTitle';
import SubtitleInfo from '../../../components/Dashboard/SubtitleInfo';
import { getHotels } from '../../../services/hotelApi';
import useToken from '../../../hooks/useToken';
import UnauthorizedMessage from '../../../components/Dashboard/UnauthorizedMessage';
import UnauthorizedMessageContainer from '../../../components/Dashboard/UnauthorizedMessageContainer';
import usePayment from '../../../hooks/api/usePayment';
import RoomButton from '../../../components/Dashboard/RoomButton';

export default function Hotel() {
  const [hotels, setHotels] = useState([]);
  const token = useToken();
  const { payment } = usePayment();
  const [hotelName, setHotelName] = useState('');

  async function getHotelsData() {
    const data = await getHotels(token);
    setHotels(data);
  }

  useEffect(() => {
    getHotelsData();
  }, []);

  function handleHotelSelection(name) {
    setHotelName(name);
  }

  if (!hotels) return <h1>Loading...</h1>;

  if (!payment) {
    return (
      <>
        <PageTitle>Escolha de hotel e quarto</PageTitle>
        <UnauthorizedMessageContainer>
          <UnauthorizedMessage>
            {' '}
            Você precisa ter confirmado pagamento antes
            <br /> de fazer a escolha de hospedagem
          </UnauthorizedMessage>
        </UnauthorizedMessageContainer>
      </>
    );
  }

  if (payment.accomodation === false) {
    return (
      <>
        <PageTitle>Escolha de hotel e quarto</PageTitle>
        <UnauthorizedMessageContainer>
          <UnauthorizedMessage>
            {' '}
            Sua modalidade de ingresso não inclui hospedagem
            <br /> Prossiga para a escolha de atividades
          </UnauthorizedMessage>
        </UnauthorizedMessageContainer>
      </>
    );
  }

  return (
    <>
      <PageTitle>Escolha de quarto e hotel</PageTitle>
      <Box sx={{ marginTop: '37px' }}>
        <SubtitleInfo>Primeiro, escolha seu hotel</SubtitleInfo>
        <Box sx={{ display: 'flex', gap: '20px' }}>
          {hotels.map((hotel) => {
            return (
              <>
                <HotelButton
                  key={hotel.hotelId}
                  onClick={() => handleHotelSelection(hotel.hotelName)}
                  selected={hotel.hotelName === hotelName}
                >
                  <img src={hotel.hotelImage} alt={hotel.hotelName}></img>
                  <HotelName>{hotel.hotelName}</HotelName>
                  <Box>
                    <InfoType>Tipos de acomodação:</InfoType>
                    <Info>{hotel.bedrooms[0].type}</Info>
                  </Box>
                  <Box>
                    <InfoType>Vagas disponíveis:</InfoType>
                    <Info>{hotel.vacancy._all - hotel.vacancy.userId}</Info>
                  </Box>
                </HotelButton>
              </>
            );
          })}
        </Box>
        {hotelName && <SubtitleInfo>Ótima pedida! Agora escolha seu quarto:</SubtitleInfo>}
        {hotelName &&
          hotels
            .filter((hotel) => hotel.hotelName === hotelName)[0]
            .bedrooms.map((bedroom) => {
              return <RoomButton info={bedroom} />;
            })}
      </Box>
    </>
  );
}
