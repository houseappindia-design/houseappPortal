// material-ui
import { useTheme } from '@mui/material/styles';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

export default function LogoMain() {
  const theme = useTheme();
  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo} alt="Mantis" width="100" />
     *
     */
    <>
      <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="100"
    height="100"
    viewBox="0 0 375 375"
    preserveAspectRatio="xMidYMid meet"
    zoomAndPan="magnify"
    version="1.2"
  >
    <defs>
      <clipPath id="clip0">
        <path d="M52.57 90.2h269.87v194.61H52.57z" />
      </clipPath>
      <clipPath id="clip1">
        <path d="M230.92 90.2c50.54 0 91.51 43.57 91.51 97.3 0 53.74-40.97 97.31-91.51 97.31h-86.84c-50.54 0-91.51-43.57-91.51-97.31 0-53.73 40.97-97.3 91.51-97.3z" />
      </clipPath>
      <clipPath id="clip2">
        <path d="M142 148h91v99.74h-91z" />
      </clipPath>
      <clipPath id="clip3">
        <path d="M123.55 126.99h127.89V191H123.55z" />
      </clipPath>
      <clipPath id="clip4">
        <path d="M169.27 187.36h36.31v67.39h-36.31z" />
      </clipPath>
      <clipPath id="clip5">
        <path d="M186.66 187.5h1.67c4.58 0 8.94 1.82 12.16 5.05a17.04 17.04 0 0 1 5.08 12.2v32.7a17.04 17.04 0 0 1-5.08 12.2c-3.22 3.23-7.58 5.05-12.16 5.05h-1.67a17.06 17.06 0 0 1-12.2-5.05 17.04 17.04 0 0 1-5.05-12.2v-32.7c0-4.62 1.82-8.97 5.05-12.2a17.06 17.06 0 0 1 12.2-5.05z" />
      </clipPath>
      <clipPath id="clip6">
        <path d="M174.8 193.61h25.39v54.44H174.8z" />
      </clipPath>
      <clipPath id="clip7">
        <path d="M187.5 193.61c3.37 0 6.6 1.33 8.98 3.72a12.57 12.57 0 0 1 3.71 8.97v29.02a12.57 12.57 0 0 1-3.71 8.97 12.57 12.57 0 0 1-8.98 3.71 12.57 12.57 0 0 1-8.97-3.71 12.57 12.57 0 0 1-3.7-8.97v-29.02c0-3.36 1.32-6.6 3.7-8.97a12.57 12.57 0 0 1 8.97-3.72z" />
      </clipPath>
    </defs>
    <g>
      <g clipPath="url(#clip0)">
        <g clipPath="url(#clip1)">
          <path fill="#ff3131" d="M52.57 90.2h269.87v194.61H52.57z" />
        </g>
      </g>
      <g clipPath="url(#clip2)">
        <path
          fill="#fff"
          d="M142.83 188.37l44.79-39.67 44.82 39.69v56.7c0 1.46-1.18 2.64-2.64 2.64h-28v-24.86c0-1.46-1.18-2.65-2.64-2.65h-23.01c-1.46 0-2.65 1.19-2.65 2.65v24.86h-28c-1.46 0-2.65-1.18-2.65-2.64z"
        />
      </g>
      <g clipPath="url(#clip3)">
        <path
          fill="#fff"
          d="M187.88 127L251.44 183.27 244.75 190.83 187.62 140.25 130.51 190.83 123.82 183.27z"
        />
      </g>
      <path fill="#fff" d="M232.43 135.1h-16.11l.14 9.54 15.97 14.43z" />
      <g clipPath="url(#clip4)">
        <g clipPath="url(#clip5)">
          <path fill="#ff3131" d="M169.41 187.5h36.17v67.25h-36.17z" />
        </g>
      </g>
      <g clipPath="url(#clip6)">
        <g clipPath="url(#clip7)">
          <path fill="#fff" d="M174.8 193.61h25.39v54.44H174.8z" />
        </g>
      </g>
    </g>
  </svg>
    </>
  );
}
