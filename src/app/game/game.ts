import { SnippetService } from '../helpers/snippet.service';

import { Card, CardLocation } from '../card/card';
import { Player, PlayerId } from '../player/player';

export class Game {
  deck: Card[];
  players: Player[]; // There can be 4 or 5 players

  turn: PlayerId;

  constructor(private snippetService: SnippetService) { }

  setup(): void {
    // Generate the deck
    this.deck = [];
    for(let color of ['red', 'yellow', 'green', 'black']){
      this.deck.push(new Card("1", color));

      for(let i=5;i<=14;i++)
        this.deck.push(new Card("" + i, color));
    }

    this.deck.push(new Card("R"));

    // Build the players
    this.players = [
      new Player(1, "James"),
      new Player(2, "Jan"),
      new Player(3, "Jackie"),
      new Player(4, "Julia")
    ];

  }
  deal(): void {
    // Shuffle and deal the cards to the players
    this.snippetService.shuffle(this.deck);

    // Go around the table twice, dealing one card to each players
    // Then give on card to the nest
    // Repeat until all the cards are dealt out

    // Generate the order to deal out
    let locationDestination: CardLocation[] = [];
    for(let player of [...this.players, ...this.players])
      locationDestination.push(player.id as CardLocation);
    locationDestination.push(0 as CardLocation);

    // Hand out shuffled cards in the order prescribed by the function above
    this.deck.forEach((card: Card, index: number) => {
      const assignTo = locationDestination[index % locationDestination.length];
      card.initialLocation = card.location = assignTo;
    });

    // Player 1 always starts
    this.turn = 1;

    console.log(this.deck);
  }

  tryPlayCard(card: Card): void {
    if(card.location !== this.turn)
      return; // Cannot play the card if it's not your turn

    card.location = CardLocation.table;
    this.turn = (this.turn) % this.players.length + 1 as PlayerId;
  }

  private filterForLocation(location: CardLocation): Card[] {
    return this.deck.filter(card => card.location === location);
  }
  getCardsForPlayer(player: Player): Card[] {
    return this.filterForLocation(player.id); // This maps to playerXhand...
  }
  getNest(): Card[] {
    return this.filterForLocation(CardLocation.nest);
  }
  getTable(): Card[] {
    return this.filterForLocation(CardLocation.table);
  }
}
