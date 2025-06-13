import { IRenderService } from '../interfaces';

export enum ERenderKeys {
  MY_SQL = 'MySQL',
}

export type TRenderMap = {
  [ERenderKeys.MY_SQL]: IRenderService;
};
