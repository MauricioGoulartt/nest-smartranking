import { IsNotEmpty } from "class-validator";
import { Player } from "src/players/interfaces/player.interface";

export class AtribuirDesafioPartidaDto {
  @IsNotEmpty()
  def: Player;

  @IsNotEmpty()
  result: Array<Result>;
}
