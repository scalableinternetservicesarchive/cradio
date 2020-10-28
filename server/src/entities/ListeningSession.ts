import { BaseEntity, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { PartyRocker } from './PartyRocker'
import { Queue } from './Queue'

@Entity()
export class ListeningSession extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  //time created is time since epoch
  @CreateDateColumn()
  timeCreated: number

  @OneToOne(type => PartyRocker)
  owner: PartyRocker

  @OneToMany(type => PartyRocker, partyRocker => partyRocker.listeningSession)
  partyRockers: PartyRocker[]

  @OneToMany(type => Queue, queue => queue.listeningSession)
  queue: Queue[]
}
