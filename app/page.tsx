"use client";
import { Provider } from "react-redux";
import store from "@/stores";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { ThemeProvider } from "@mui/material/styles";
import muiTheme from "@/MuiTheme";
import { useAppSelector } from "@/hooks";
import LoginDialog from "@/components/LoginDialog";
const PhaserGame = dynamic(() => import("../components/PhaserGame"), {
	ssr: false, // This ensures the component only renders on client-side
});
/* import HelperButtonGroup from "@/components/HelperButtonGroup"; */
import HomeScreenDialog from "@/components/HomeScreenDialog";
const Backdrop = styled.div`
	position: absolute;
	height: 100%;
	width: 100%;
`;
export default function Home() {
	const loggedIn = useAppSelector((state) => state.user.loggedIn);
	const readyToConnect = useAppSelector((state) => state.user.readyToConnect);
	return (
		<>
			<Provider store={store}>
				<ThemeProvider theme={muiTheme}>
					<Backdrop>
						<PhaserGame />
						{!loggedIn && <HomeScreenDialog />}
						{loggedIn && !readyToConnect && <LoginDialog />}
						{/* <HelperButtonGroup /> */}
					</Backdrop>
				</ThemeProvider>
			</Provider>
		</>
	);
}
