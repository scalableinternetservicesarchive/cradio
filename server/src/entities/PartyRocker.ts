import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ListeningSession } from './ListeningSession'

//currently user just copied from his code but change this to be our user. I didnt wanna delete his user file and break code

@Entity()
export class PartyRocker extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 50,
  })
  name: string

  @Column({nullable:true})
  spotifyCreds: string

  @ManyToOne(type => ListeningSession, listeningSession => listeningSession.partyRockers, {onDelete: 'CASCADE' })
  //@ManyToOne(type => ListeningSession, listeningSession => listeningSession.partyRockers)
  //@JoinColumn()
  listeningSession: ListeningSession

}
