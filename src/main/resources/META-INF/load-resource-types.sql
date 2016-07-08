INSERT INTO ResourceType (created, lastUpdated, identifier, name) VALUES (now(), now(), '0101', 'Logo');
INSERT INTO ResourceType (created, lastUpdated, identifier, name) VALUES (now(), now(), '0102', 'Zon tabel');
INSERT INTO ResourceType (created, lastUpdated, identifier, name) VALUES (now(), now(), '0103', 'Rekvisitions tabel');
INSERT INTO ResourceType (created, lastUpdated, identifier, name) VALUES (now(), now(), '0104', 'Kreditkort tabel');
INSERT INTO ResourceType (created, lastUpdated, identifier, name) VALUES (now(), now(), '0105', 'Tillägs tabel');
INSERT INTO ResourceType (created, lastUpdated, identifier, name) VALUES (now(), now(), '0106', 'Kredittype tabel');
INSERT INTO ResourceType (created, lastUpdated, identifier, name) VALUES (now(), now(), '0107', 'MegTax tabel');
INSERT INTO ResourceType (created, lastUpdated, identifier, name) VALUES (now(), now(), '2101', 'Au2Tax program');
INSERT INTO ResourceType (created, lastUpdated, identifier, name) VALUES (now(), now(), '2102', 'Tariff tabel');
INSERT INTO ResourceType (created, lastUpdated, identifier, name) VALUES (now(), now(), '2103', 'Kvitto logo');

INSERT INTO Server (created, lastUpdated, name, identifier) VALUES (now(), now(), 'Taxi Göteborg', 30);

SET @server1id = (SELECT id FROM Server WHERE identifier = 30);

INSERT INTO Central (created, lastUpdated, name, identifier, serverId) VALUES (now(), now(), 'Taxi Göteborg', 1, @server1id);
INSERT INTO Central (created, lastUpdated, name, identifier, serverId) VALUES (now(), now(), 'Taxi Göteborg utbilding', 3, @server1id);
INSERT INTO Central (created, lastUpdated, name, identifier, serverId) VALUES (now(), now(), 'Taxi Kungsbocka', 4, @server1id);
INSERT INTO Central (created, lastUpdated, name, identifier, serverId) VALUES (now(), now(), 'Taxi Stenungsund', 5, @server1id);
INSERT INTO Central (created, lastUpdated, name, identifier, serverId) VALUES (now(), now(), 'Öckerö', 6, @server1id);
INSERT INTO Central (created, lastUpdated, name, identifier, serverId) VALUES (now(), now(), 'VOLVO AB', 30, @server1id);

SET @server1central1id = (SELECT id FROM Central WHERE identifier = 1 AND serverId = @server1id);

INSERT INTO Setting (created, lastUpdated, name, centralId) VALUES (now(), now(), 'Setting 1', @server1central1id);
INSERT INTO Setting (created, lastUpdated, name, centralId) VALUES (now(), now(), 'Setting 2', @server1central1id);
INSERT INTO Setting (created, lastUpdated, name, centralId) VALUES (now(), now(), 'Setting 3', @server1central1id);

SET @server1central1setting1id = (SELECT id FROM Setting WHERE centralId = @server1central1id AND name = 'Setting 1');
UPDATE Central SET defaultSettingId = @server1central1setting1id WHERE id = @server1central1id;

SET @server1central2id = (SELECT id FROM Central WHERE identifier = 3 AND serverId = @server1id);

INSERT INTO Setting (created, lastUpdated, name, centralId) VALUES (now(), now(), 'Setting 1', @server1central2id);
INSERT INTO Setting (created, lastUpdated, name, centralId) VALUES (now(), now(), 'Setting 2', @server1central2id);
INSERT INTO Setting (created, lastUpdated, name, centralId) VALUES (now(), now(), 'Setting 3', @server1central2id);

SET @server1central2setting1id = (SELECT id FROM Setting WHERE centralId = @server1central2id AND name = 'Setting 1');
UPDATE Central SET defaultSettingId = @server1central2setting1id WHERE id = @server1central2id;

SET @server1central3id = (SELECT id FROM Central WHERE identifier = 4 AND serverId = @server1id);

INSERT INTO Setting (created, lastUpdated, name, centralId) VALUES (now(), now(), 'Setting 1', @server1central3id);
INSERT INTO Setting (created, lastUpdated, name, centralId) VALUES (now(), now(), 'Setting 2', @server1central3id);
INSERT INTO Setting (created, lastUpdated, name, centralId) VALUES (now(), now(), 'Setting 3', @server1central3id);

SET @server1central3setting1id = (SELECT id FROM Setting WHERE centralId = @server1central3id AND name = 'Setting 1');
UPDATE Central SET defaultSettingId = @server1central3setting1id WHERE id = @server1central3id;

SET @server1central4id = (SELECT id FROM Central WHERE identifier = 5 AND serverId = @server1id);

INSERT INTO Setting (created, lastUpdated, name, centralId) VALUES (now(), now(), 'Setting 1', @server1central4id);
INSERT INTO Setting (created, lastUpdated, name, centralId) VALUES (now(), now(), 'Setting 2', @server1central4id);
INSERT INTO Setting (created, lastUpdated, name, centralId) VALUES (now(), now(), 'Setting 3', @server1central4id);

SET @server1central4setting1id = (SELECT id FROM Setting WHERE centralId = @server1central4id AND name = 'Setting 1');
UPDATE Central SET defaultSettingId = @server1central4setting1id WHERE id = @server1central4id;

SET @server1central5id = (SELECT id FROM Central WHERE identifier = 6 AND serverId = @server1id);

INSERT INTO Setting (created, lastUpdated, name, centralId) VALUES (now(), now(), 'Setting 1', @server1central5id);
INSERT INTO Setting (created, lastUpdated, name, centralId) VALUES (now(), now(), 'Setting 2', @server1central5id);
INSERT INTO Setting (created, lastUpdated, name, centralId) VALUES (now(), now(), 'Setting 3', @server1central5id);

SET @server1central5setting1id = (SELECT id FROM Setting WHERE centralId = @server1central5id AND name = 'Setting 1');
UPDATE Central SET defaultSettingId = @server1central5setting1id WHERE id = @server1central5id;

SET @server1central6id = (SELECT id FROM Central WHERE identifier = 30 AND serverId = @server1id);

INSERT INTO Setting (created, lastUpdated, name, centralId) VALUES (now(), now(), 'Setting 1', @server1central6id);
INSERT INTO Setting (created, lastUpdated, name, centralId) VALUES (now(), now(), 'Setting 2', @server1central6id);
INSERT INTO Setting (created, lastUpdated, name, centralId) VALUES (now(), now(), 'Setting 3', @server1central6id);

SET @server1central6setting1id = (SELECT id FROM Setting WHERE centralId = @server1central6id AND name = 'Setting 1');
UPDATE Central SET defaultSettingId = @server1central6setting1id WHERE id = @server1central6id;

INSERT INTO User (created, lastUpdated, email, digest, salt, username) VALUES (now(), now(), 'rasmus@bnr.dk', 'mlbhpOHV+z3aY7BEn4HRx01ziXGx5g9cmbSd8xpg1zg=', 'xsYlxEK79BGjo+fxhr86cMhToPUPo4PJSJoVxkwS0oI=', 'rasmus');
INSERT INTO User (created, lastUpdated, email, digest, salt, username) VALUES (now(), now(), 'mikkel@bnr.dk', 'mlbhpOHV+z3aY7BEn4HRx01ziXGx5g9cmbSd8xpg1zg=', 'xsYlxEK79BGjo+fxhr86cMhToPUPo4PJSJoVxkwS0oI=', 'mikkel');
INSERT INTO User (created, lastUpdated, email, digest, salt, username) VALUES (now(), now(), 'tommy@bnr.dk', 'mlbhpOHV+z3aY7BEn4HRx01ziXGx5g9cmbSd8xpg1zg=', 'xsYlxEK79BGjo+fxhr86cMhToPUPo4PJSJoVxkwS0oI=', 'tommy');
